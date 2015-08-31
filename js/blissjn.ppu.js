////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.PPU = function( memory ) {
  this.memory          = memory;
  this.scanline        = 0;
  this.regs            = { r0: 0, r1: 0, r2: 0, r3: 0, r4: 0, r5: 0, r6: 0, r7: 0, r14 : 0 };
  this.firstWrite      = true;
  this.address         = 0;
  this.increment       = 1;
  this.screen          = [];
  this.bkgEnabled      = true;
  this.bkgNameTable    = 0x2000;
  this.bkgPatternTable = 0;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.PPU.prototype.reset = function() {
  this.scanline        = 0;
  this.regs            = { r0: 0, r1: 0, r2: 0, r3: 0, r4: 0, r5: 0, r6: 0, r7: 0, r14 : 0 };
  this.firstWrite      = true;
  this.address         = 0;
  this.increment       = 1;
  this.screen          = [];
  this.bkgEnabled      = true;
  this.bkgNameTable    = 0x2000;
  this.bkgPatternTable = 0;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.PPU.prototype.getBuffer = function() {
  return this.screen;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.PPU.prototype.getPatternTable = function() {
  return this.bkgPatternTable;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.PPU.prototype.readRegister = function( reg ) {
  var r = 0;

  switch( reg ) {
    case 0: { // PPUCTRL
      r = this.regs.r0;
    } break;

    case 1: { // PPUMASK
      r = this.regs.r1;
    } break;

    case 2: { // PPUSTATUS
      r = this.regs.r2;
      this.regs.r2 &= ~0x80;
      this.firstWrite = true;
    } break;

    case 7: { // PPUDATA
      r = this.memory.readVram( this.address );
      this.address = ( this.address + this.increment ) & 0xffff;
    } break;

    default: {
      configuration.running = false;
      throw 'invalid ppu read < @' + reg + ' >';
    } break;
  }

  return r;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.PPU.prototype.writeRegister = function( reg, value ) {
  switch( reg ) {
    case 0: { // PPUCTRL
      this.regs.r0         = value;
      this.bkgNameTable    = ( (value & 0x3) * 0x400 + 0x2000 ) & 0xffff;
      this.increment       = ( (value & 0x4) === 0x4 ? 32 : 1 );
      this.bkgPatternTable = ( (value & 0x10) === 0x10 ? 0x1000 : 0 );
    } break;

    case 1: { // PPUMASK
      this.regs.r1 = value;
      this.bkgEnabled = ( (value & 0x8) === 0x8 ? true : false );
    } break;

    case 3: { // OAMADDR
      // TODO: sprites
      this.regs.r3 = value;
    } break;

    case 5: { // PPUSCROLL
      // TODO: scrolling
      this.firstWrite ^= true;
    } break;

    case 6: { // PPUADDR
      if( this.firstWrite ) {
        this.address = value;
      } else {
        this.address = ( this.address | value ) & 0xffff;
      }
      this.firstWrite ^= true;
    } break;

    case 7: { // PPUDATA
      this.memory.writeVram( this.address, value );
      this.address = ( this.address + this.increment ) & 0xffff;
    } break;

    default: {
      configuration.running = false;
      throw 'invalid ppu write < @' + reg + ':' + value.toHex(2) + ' >';
    } break;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.PPU.prototype.runScanline = function() {
  var nmi = false;

  // pre-render scanline
  if( this.scanline === 0 ) {
    this.screen = [];
  }

  // visible scanlines
  else if( this.scanline <= 240 ) {
    if( this.bkgEnabled ) this.drawBrackground();
  }

  // post-render scanline
  else if( this.scanline === 241 ) {
    this.regs.r2 |= 0x80;
    nmi = ( (this.regs.r0 & 0x80) === 0x80 ? true : false );
  }

  // last vblank scanline
  else if( this.scanline === 261 ) {
    this.regs.r2 &= ~0x80;
    this.scanline = -1;
  }

  this.scanline++;

  return nmi;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.PPU.prototype.drawBrackground = function() {
  for( var tile = 0; tile < 32; tile++ ) {
    var index = this.memory.readVram( (this.bkgNameTable + tile) & 0xffff );
    var l = this.memory.readVram( (this.bkgPatternTable + index * 16 + this.scanline) & 0xffff );
    var h = this.memory.readVram( (this.bkgPatternTable + index * 16 + this.scanline + 8) & 0xffff );
    for( var pixel = 7; pixel >= 0; pixel-- ) {
      var c0 = ( l >> pixel ) & 0x1, c1 = ( h >> pixel ) & 0x1;
      var colour = ( (c1 << 1) | c0 ) & 0x3;
      this.screen.push( this.memory.readVram((0x3f00 + colour) & 0xffff) );
    }
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
