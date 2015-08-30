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
  nestestMode: true,
  running: false,
  fps: 60
};

////////////////////////////////////////////////////////////////////////////////////////////////////

var $ = document.querySelector.bind( document );

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN = function( args ) {
  this.memory = {
    ram:  [],
    vram: [],
    sram: []
  };
  this.dbg   = new BlissJN.Debugger( args.traceFrame );
  this.m6502 = new BlissJN.M6502( this.memoryHandler(), this.dbg );

  this.options = args;

  // FIXME: harcoded
  this.loadGame( args.gameData );
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.reset = function() {
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

  configuration.running = true;
  this.m6502.reset();
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
    self.step();
  }, Math.floor(1000 / configuration.fps));
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.step = function() {
  var opcode = this.m6502.fetch();
  this.m6502.execute( opcode );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.prototype.memoryHandler = function() {
  var self = this;
  return {
    readRam: function( address ) {
      return self.memory.ram[ address ];
    },

    writeRam: function( address, value ) {
      self.memory.ram[ address ] = value;
    }
  };
};

////////////////////////////////////////////////////////////////////////////////////////////////////
