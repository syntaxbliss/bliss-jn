////////////////////////////////////////////////////////////////////////////////////////////////////

var $ = document.querySelector.bind( document );

////////////////////////////////////////////////////////////////////////////////////////////////////

Number.prototype.toHex = function( size ) {
  var r = this.toString(16).toUpperCase();
  while( r.length < size ) r = '0'+ r;
  return r;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

String.prototype.toLength = function( size, separator ) {
  var r = this;
  while( r.length < size ) r += ( separator || ' ' );
  return r;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

var configuration = {
  nestestMode: false,
  debugMode: true,
  logTrace: false,
  running: false,
  fps: 60,
  screen: { width: 256, height: 240 },
  palette: [
    0x757575, 0x271b8f, 0x0000ab, 0x47009f, 0x8f0077, 0xab0013, 0xa70000, 0x7f0b00,
    0x432f00, 0x004700, 0x005100, 0x003f17, 0x1b3f5f, 0x000000, 0x000000, 0x000000,
    0xbcbcbc, 0x0073ef, 0x233bef, 0x8300f3, 0xbf00bf, 0xe7005b, 0xdb2b00, 0xcb4f0f,
    0x8b7300, 0x009700, 0x00ab00, 0x00933b, 0x00838b, 0x000000, 0x000000, 0x000000,
    0xffffff, 0x3fbfff, 0x5f97ff, 0xa78bfd, 0xf77bff, 0xff77b7, 0xff7763, 0xff9b3b,
    0xf3bf3f, 0x83d313, 0x4fdf4b, 0x58f898, 0x00ebdb, 0x000000, 0x000000, 0x000000,
    0xffffff, 0xabe7ff, 0xc7d7ff, 0xd7cbff, 0xffc7ff, 0xffc7db, 0xffbfb3, 0xffdbab,
    0xffe7a3, 0xe3ffa3, 0xabf3bf, 0xb3ffcf, 0x9ffff3, 0x000000, 0x000000, 0x000000
  ]
};

////////////////////////////////////////////////////////////////////////////////////////////////////

var interrupt = {
  nmi: 1
};

////////////////////////////////////////////////////////////////////////////////////////////////////

var mirroring = {
  vertical: 0,
  horizontal: 1
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN = function( args ) {
  this.mirroring  = null;
  this.vramBuffer = 0;
  this.ticks      = 0;
  this.memory     = { rom: [], vram: [], sram: [] };

  this.dbg   = new BlissJN.Debugger({
    memory: this.memoryHandler(),
    stackTrace: args.stackTrace,
    patternTables: args.patternTables,
    nameTables: args.nameTables
  });

  this.m6502 = new BlissJN.M6502( this.memoryHandler(), this.dbg );
  this.ppu   = new BlissJN.PPU( this.memoryHandler() );

  this.target = {
    canvas: args.target,
    context: $( args.target ).getContext('2d')
  };

  this.options = args;
  this.prepare();

  // FIXME: harcoded
  this.loadGame( args.gameData );
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.prepare = function() {
  if( this.options.stopTrace && configuration.logTrace ) {
    $( this.options.stopTrace ).addEventListener('click', function() {
      if( configuration.logTrace ) {
        configuration.logTrace = false;
        this.innerHTML = 'continue trace';
        console.log('log trace stopped');
      } else {
        configuration.logTrace = true;
        this.innerHTML = 'stop trace';
        console.log('log trace resummed');
      }
    });
  }

  if( this.options.stopEmulation ) {
    $( this.options.stopEmulation ).addEventListener('click', function() {
      configuration.running = false;
      console.log('emulation stopped');
    });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.reset = function() {
  this.mirroring  = null;
  this.vramBuffer = 0;
  this.ticks      = 0;
  for( var i = 0; i < 0x10000; i++ ) this.memory.rom[ i ] = 0x00;
  for( var i = 0; i < 0x4000; i++ ) this.memory.vram[ i ] = 0x00;
  for( var i = 0; i < 0x100; i++ ) this.memory.sram[ i ] = 0x00;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.loadGame = function( data ) {
  this.reset();

  var romBanks = data[ 4 ], index = 0;

  if( romBanks === 1 ) {
    for( var i = 0; i < 0x4000; i++ ) {
      this.memory.rom[ 0x8000 + i ] = this.memory.rom[ 0xc000 + i ] = data[ 16 + index++ ];
    }
  } else if( romBanks === 2 ) {
    for( var i = 0; i < 0x8000; i++ ) {
      this.memory.rom[ 0x8000 + i ] = data[ 16 + index++ ];
    }
  } else {
    throw 'too many PRG-ROM banks';
  }

  for( var i = 0; i < 0x2000; i++ ) {
    this.memory.vram[ i ] = data[ 16 + index++ ];
  }

  var m = data[ 6 ];
  if( ! this.setMirroring(m) ) {
    throw 'mirroring not supported < @' + m + ' >';
    return;
  }

  configuration.running = true;
  this.m6502.reset();
  this.ppu.reset();
  this.run();
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.setMirroring = function( value ) {
  var r = true;

  switch( value ) {
    case 0: this.mirroring = mirroring.vertical; break;
    case 1: this.mirroring = mirroring.horizontal; break;
    default: r = false; break;
  }

  return r;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.run = function() {
  var self = this;
  var fn = setInterval( function() {
    if( ! configuration.running ) {
      clearInterval( fn );
      return;
    }

    if( configuration.debugMode ) {
      self.dbg.showPatternTables();
      self.dbg.showNameTables( self.ppu.getPatternTable() );
    }

    self.step();
  }, Math.floor(1000 / configuration.fps));
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.step = function() {
  var current = 0, timmingTable = [ 114, 114, 113 ];

  for( var scanline = 0; scanline < 262; scanline++ ) {
    while( this.ticks < timmingTable[current % 3] ) {
      var opcode = this.m6502.fetch();
      this.ticks += this.m6502.execute( opcode );
    }

    this.ticks -= timmingTable[ current % 3 ];
    current++;

    var nmi = this.ppu.runScanline();
    if( nmi ) this.m6502.triggerInterrupt( interrupt.nmi );
  }

  this.render( this.ppu.getBuffer() );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.memoryHandler = function() {
  var self = this;
  return {
    readMemory: function( address ) {
      // ram
      if( address < 0x2000 ) {
        return self.memory.rom[ address & 0x7ff ];
      }

      // ppu register
      else if( (address >= 0x2000) && (address < 0x4000) ) {
        return self.ppu.readRegister( address & 0x7 );
      }

      // fallback
      else return self.memory.rom[ address ];
    },

    writeMemory: function( address, value ) {
      // ram
      if( address < 0x2000 ) {
        self.memory.rom[ address & 0x7ff ] = value;
      }

      // ppu register
      else if( (address >= 0x2000) && (address < 0x4000) ) {
        self.ppu.writeRegister( address & 0x7, value );
      }

      // fallback
      else self.memory.rom[ address ] = value;
    },

    readVram: function( address ) {
      var r = 0, a = self.vramMirroring( address );

      // outside palette range
      if( a < 0x3f00 ) {
        r = self.vramBuffer;
        self.vramBuffer = self.memory.vram[ a ];
      }

      // inside palette range
      else {
        r = self.memory.vram[ a ];
        self.vramBuffer = self.memory.vram[(a - 0x1000) & 0xffff];
      }

      return r;
    },

    writeVram: function( address, value ) {
      var a = self.vramMirroring( address );
      if     ( a < 0x2000 ) self.writePatternTable( address, value );
      else if( a < 0x3000 ) self.writeNameTable( address, value );
      else                  self.writePalette( address, value );
    }
  };
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.vramMirroring = function( address ) {
  address &= 0x3fff;

  // name table mirroring
  if( (address >= 0x3000) && (address < 0x3f00) ) {
    address = ( address & 0x2eff );
  }

  // palette mirroring
  else if( (address >= 0x3f20) && (address < 0x4000) ) {
    address = ( address & 0x3f1f );
  }

  return address;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.writePatternTable = function( address, value ) {
  this.memory.vram[ address ] = value;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.writeNameTable = function( address, value ) {
  // horizontal => $2000:$2400 - $2800:$2C00
  if( this.mirroring === mirroring.horizontal ) {
    var a = address & 0x2c00;
    if( (a === 0x2000) || (a === 0x2800) ) {
      this.memory.vram[ address ] = value;
      this.memory.vram[ address + 0x400 ] = value;
    } else {
      this.memory.vram[ address ] = value;
      this.memory.vram[ address - 0x400 ] = value;
    }
  }

  // vertical => $2000:$2800 - $2400:$2C00
  else if( this.mirroring === mirroring.vertical ) {
    var a = address & 0x2c00;
    if( (a === 0x2000) || (a === 0x2400) ) {
      this.memory.vram[ address ] = value;
      this.memory.vram[ address + 0x800 ] = value;
    } else {
      this.memory.vram[ address ] = value;
      this.memory.vram[ address - 0x800 ] = value;
    }
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.writePalette = function( address, value ) {
  value &= 0x3f;
  while( address < 0x3f20 ) {
    this.memory.vram[ address ] = value;
    address += 0x10;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.render = function( data ) {
  var w       = configuration.screen.width, h = configuration.screen.height;
  var imgData = this.target.context.createImageData( w, h );

  var index = 0;
  data.forEach( function(i) {
    var colour = configuration.palette[ i ];
    imgData.data[ index++ ] = ( colour >> 16 ) & 0xff;
    imgData.data[ index++ ] = ( colour >> 8 ) & 0xff;
    imgData.data[ index++ ] = colour & 0xff;
    imgData.data[ index++ ] = 255;
  });
  this.target.context.putImageData( imgData, 0, 0 );
};

////////////////////////////////////////////////////////////////////////////////////////////////////
