////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.PPU = function( memory ) {
  this.memory     = memory;
  this.scanline   = 0;
  this.regs       = { r0: 0, r1: 0, r2: 0, r3: 0, r4: 0, r5: 0, r6: 0, r7: 0, r14 : 0 };
  this.firstWrite = true;
  this.address    = 0;
  this.increment  = 1;
  this.buffer     = 0;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.PPU.prototype.reset = function() {
  this.scanline   = 0;
  this.regs       = { r0: 0, r1: 0, r2: 0, r3: 0, r4: 0, r5: 0, r6: 0, r7: 0, r14 : 0 };
  this.firstWrite = true;
  this.address    = 0;
  this.increment  = 1;
  this.buffer     = 0;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.PPU.prototype.readRegister = function( reg ) {
  switch( reg ) {
    case 0: { // PPUCTRL
      return this.regs.r0;
    } break;

    case 1: { // PPUMASK
      return this.regs.r1;
    } break;

    case 2: { // PPUSTATUS
      var r = this.regs.r2;
      this.regs.r2    &= ~0x80;
      this.firstWrite = true;
      return r;
    } break;

    case 7: { // PPUDATA
      var r = 0;

      // outside palette range
      if( this.address < 0x3f00 ) {
        r = this.buffer;
        this.buffer = this.memory.readVram( this.address );
      }

      // inside palette range
      else {
        r = this.readVram( this.address );
      }

      this.address = ( this.address + this.increment ) & 0xffff;
    } break;

    default: {
      configuration.running = false;
      throw 'invalid ppu read < @' + reg + ' >';
    } break;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.PPU.prototype.writeRegister = function( reg, value ) {
  switch( reg ) {
    case 0: { // PPUCTRL
      this.regs.r0   = value;
      this.increment = ( (value & 0x4) === 0x4 ? 32 : 1 );
    } break;

    case 1: { // PPUMASK
      this.regs.r1 = value;
    } break;

    case 3: { // OAMADDR
      // TODO: sprites
      this.regs.r3 = value;
    } break;

    case 5: { // PPUSCROLL
      // TODO: scrolling
    } break;

    case 6: { // PPUADDR
      if( this.firstWrite ) {
        this.address = value;
      } else {
        this.address = ( this.address | value );
      }
      this.firstWrite ^= true;
    } break;

    case 7: { // PPUDATA
      this.memory.writeVram( this.address );
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
  if( this.scanline === 0 ) {}

  // visible scanlines
  else if( this.scanline <= 240 ) {}

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
