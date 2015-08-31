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
  running: false,
  fps: 60
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
  this.ticks  = 0;
  this.memory = {
    ram:  [],
    vram: [],
    sram: [],
    mirroring: mirroring.horizontal
  };

  this.dbg   = new BlissJN.Debugger({
    memory: this.memoryHandler(),
    stackTrace: args.stackTrace,
    patternTables: args.patternTables
  });

  this.m6502 = new BlissJN.M6502( this.memoryHandler(), this.dbg );
  this.ppu   = new BlissJN.PPU( this.memoryHandler() );

  this.options = args;

  // FIXME: harcoded
  this.loadGame( args.gameData );
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.reset = function() {
  this.ticks = 0;
  for( var i = 0; i < 0x10000; i++ ) this.memory.ram[ i ] = 0x00;
  for( var i = 0; i < 0x4000; i++ ) this.memory.vram[ i ] = 0x00;
  for( var i = 0; i < 0x100; i++ ) this.memory.sram[ i ] = 0x00;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.loadGame = function( data ) {
  this.reset();

  var romBanks = data[ 4 ], index = 0;

  if( romBanks === 1 ) {
    for( var i = 0; i < 0x4000; i++ ) {
      this.memory.ram[ 0x8000 + i ] = this.memory.ram[ 0xc000 + i ] = data[ 16 + index++ ];
    }
  } else if( romBanks === 2 ) {
    for( var i = 0; i < 0x8000; i++ ) {
      this.memory.ram[ 0x8000 + i ] = data[ 16 + index++ ];
    }
  } else {
    throw 'too many PRG-ROM banks';
  }

  for( var i = 0; i < 0x2000; i++ ) {
    this.memory.vram[ i ] = data[ 16 + index++ ];
  }

  this.memory.mirroring = data[ 6 ];

  configuration.running = true;
  this.m6502.reset();
  this.ppu.reset();
  this.run();
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.run = function() {
  var self = this;
  var fn = setInterval( function() {
    if( ! configuration.running ) {
      clearInterval( fn );
      return;
    }
    if( configuration.debugMode ) self.dbg.showPatternTables();
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
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.memoryHandler = function() {
  var self = this;
  return {
    readRam: function( address ) {
      // ppu register
      if( (address >= 0x2000) && (address < 0x4000) ) {
        return self.ppu.readRegister( address & 0x7 );
      }

      // fallback
      else return self.memory.ram[ address ];
    },

    writeRam: function( address, value ) {
      // ppu register
      if( (address >= 0x2000) && (address < 0x4000) ) {
        self.ppu.writeRegister( address & 0x7, value );
      }

      // fallback
      else self.memory.ram[ address ] = value;
    },

    readVram: function( address ) {
      return self.memory.vram[ self.vramMirroring(address) ];
    },

    writeVram: function( address, value ) {
      self.memory.vram[ self.vramMirroring(address) ] = value;
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
  if( (address >= 0x3f20) && (address < 0x4000) ) {
    address = ( address & 0x3f1f );
  }

  // fallback
  else return address;
};

////////////////////////////////////////////////////////////////////////////////////////////////////
