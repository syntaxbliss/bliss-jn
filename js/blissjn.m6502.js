////////////////////////////////////////////////////////////////////////////////////////////////////

var FLAG_N = 0x80;
var FLAG_V = 0x40;
var FLAG_P = 0x20;
var FLAG_B = 0x10;
var FLAG_D = 0x8;
var FLAG_I = 0x4;
var FLAG_Z = 0x2;
var FLAG_C = 0x1;

////////////////////////////////////////////////////////////////////////////////////////////////////

var ZN = [
  FLAG_Z,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
       0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
       0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
       0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
       0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
       0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
       0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
       0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
  FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
  FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
  FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
  FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
  FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
  FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
  FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
  FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N
];

////////////////////////////////////////////////////////////////////////////////////////////////////

var ABS =  1; // absolute
var ABX =  2; // absolute x
var ABY =  3; // absolute y
var ACC =  4; // accumulator
var AXN =  5; // absolute x (no page crossing)
var AYN =  6; // absolute y (no page crossing)
var IMM =  7; // immediate
var IMP =  8; // implied
var IND =  9; // indirect
var INX = 10; // indirect x
var INY = 11; // indirect y
var IYN = 12; // indirect y (no page crossing)
var REL = 13; // relative
var ZEP = 14; // zero page
var ZPX = 15; // zero page, x
var ZPY = 16; // zero page, y

////////////////////////////////////////////////////////////////////////////////////////////////////

var opcodeInfo = {
  name: [
  //          0      1      2      3      4      5      6      7      8      9      a      b      c      d      e      f
  /* 0 */  null, 'ORA',  null,  null,  null, 'ORA', 'ASL',  null, 'PHP', 'ORA', 'ASL',  null,  null, 'ORA', 'ASL',  null,
  /* 1 */ 'BPL', 'ORA',  null,  null,  null, 'ORA', 'ASL',  null, 'CLC', 'ORA',  null,  null,  null, 'ORA', 'ASL',  null,
  /* 2 */ 'JSR', 'AND',  null,  null, 'BIT', 'AND', 'ROL',  null, 'PLP', 'AND', 'ROL',  null, 'BIT', 'AND', 'ROL',  null,
  /* 3 */ 'BMI', 'AND',  null,  null,  null, 'AND', 'ROL',  null, 'SEC', 'AND',  null,  null,  null, 'AND', 'ROL',  null,
  /* 4 */ 'RTI', 'EOR',  null,  null,  null, 'EOR', 'LSR',  null, 'PHA', 'EOR', 'LSR',  null, 'JMP', 'EOR', 'LSR',  null,
  /* 5 */ 'BVC', 'EOR',  null,  null,  null, 'EOR', 'LSR',  null,  null, 'EOR',  null,  null,  null, 'EOR', 'LSR',  null,
  /* 6 */ 'RTS', 'ADC',  null,  null,  null, 'ADC', 'ROR',  null, 'PLA', 'ADC', 'ROR',  null, 'JMP', 'ADC', 'ROR',  null,
  /* 7 */ 'BVS', 'ADC',  null,  null,  null, 'ADC', 'ROR',  null, 'SEI', 'ADC',  null,  null,  null, 'ADC', 'ROR',  null,
  /* 8 */  null, 'STA',  null,  null, 'STY', 'STA', 'STX',  null, 'DEY',  null, 'TXA',  null, 'STY', 'STA', 'STX',  null,
  /* 9 */ 'BCC', 'STA',  null,  null, 'STY', 'STA', 'STX',  null, 'TYA', 'STA', 'TXS',  null,  null, 'STA',  null,  null,
  /* a */ 'LDY', 'LDA', 'LDX',  null, 'LDY', 'LDA', 'LDX',  null, 'TAY', 'LDA', 'TAX',  null, 'LDY', 'LDA', 'LDX',  null,
  /* b */ 'BCS', 'LDA',  null,  null, 'LDY', 'LDA', 'LDX',  null, 'CLV', 'LDA', 'TSX',  null, 'LDY', 'LDA', 'LDX',  null,
  /* c */ 'CPY', 'CMP',  null,  null, 'CPY', 'CMP', 'DEC',  null, 'INY', 'CMP', 'DEX',  null, 'CPY', 'CMP', 'DEC',  null,
  /* d */ 'BNE', 'CMP',  null,  null,  null, 'CMP', 'DEC',  null, 'CLD', 'CMP',  null,  null,  null, 'CMP', 'DEC',  null,
  /* e */ 'CPX', 'SBC',  null,  null, 'CPX', 'SBC', 'INC',  null, 'INX', 'SBC', 'NOP',  null, 'CPX', 'SBC', 'INC',  null,
  /* f */ 'BEQ', 'SBC',  null,  null,  null, 'SBC', 'INC',  null, 'SED', 'SBC',  null,  null,  null, 'SBC', 'INC',  null
  ],

  mode: [
  //         0     1     2     3     4     5     6     7     8     9     a     b     c     d     e     f
  /* 0 */ null,  INX, null, null, null,  ZEP,  ZEP, null,  IMP,  IMM,  ACC, null, null,  ABS,  ABS, null,
  /* 1 */  REL,  INY, null, null, null,  ZPX,  ZPX, null,  IMP,  ABY, null, null, null,  ABX,  AXN, null,
  /* 2 */  ABS,  INX, null, null,  ZEP,  ZEP,  ZEP, null,  IMP,  IMM,  ACC, null,  ABS,  ABS,  ABS, null,
  /* 3 */  REL,  INY, null, null, null,  ZPX,  ZPX, null,  IMP,  ABY, null, null, null,  ABX,  AXN, null,
  /* 4 */  IMP,  INX, null, null, null,  ZEP,  ZEP, null,  IMP,  IMM,  ACC, null,  ABS,  ABS,  ABS, null,
  /* 5 */  REL,  INY, null, null, null,  ZPX,  ZPX, null, null,  ABY, null, null, null,  ABX,  AXN, null,
  /* 6 */  IMP,  INX, null, null, null,  ZEP,  ZEP, null,  IMP,  IMM,  ACC, null,  IND,  ABS,  ABS, null,
  /* 7 */  REL,  INY, null, null, null,  ZPX,  ZPX, null,  IMP,  ABY, null, null, null,  ABX,  AXN, null,
  /* 8 */ null,  INX, null, null,  ZEP,  ZEP,  ZEP, null,  IMP, null,  IMP, null,  ABS,  ABS,  ABS, null,
  /* 9 */  REL,  IYN, null, null,  ZPX,  ZPX,  ZPY, null,  IMP,  AYN,  IMP, null, null,  AXN, null, null,
  /* a */  IMM,  INX,  IMM, null,  ZEP,  ZEP,  ZEP, null,  IMP,  IMM,  IMP, null,  ABS,  ABS,  ABS, null,
  /* b */  REL,  INY, null, null,  ZPX,  ZPX,  ZPY, null,  IMP,  ABY,  IMP, null,  ABX,  ABX,  ABY, null,
  /* c */  IMM,  INX, null, null,  ZEP,  ZEP,  ZEP, null,  IMP,  IMM,  IMP, null,  ABS,  ABS,  ABS, null,
  /* d */  REL,  INY, null, null, null,  ZPX,  ZPX, null,  IMP,  ABY, null, null, null,  ABX,  AXN, null,
  /* e */  IMM,  INX, null, null,  ZEP,  ZEP,  ZEP, null,  IMP,  IMM,  IMP, null,  ABS,  ABS,  ABS, null,
  /* f */  REL,  INY, null, null, null,  ZPX,  ZPX, null,  IMP,  ABY, null, null, null,  ABX,  AXN, null
  ],

  ticks: [
  //      0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
  /* 0 */ 0, 6, 0, 0, 0, 3, 5, 0, 3, 2, 2, 0, 0, 4, 6, 0,
  /* 1 */ 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0,
  /* 2 */ 6, 6, 0, 0, 3, 3, 5, 0, 4, 2, 2, 0, 4, 4, 6, 0,
  /* 3 */ 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0,
  /* 4 */ 6, 6, 0, 0, 3, 3, 5, 0, 3, 2, 2, 0, 3, 4, 6, 0,
  /* 5 */ 2, 5, 0, 0, 0, 4, 6, 0, 0, 4, 0, 0, 0, 4, 7, 0,
  /* 6 */ 6, 6, 0, 0, 0, 3, 5, 0, 4, 2, 2, 0, 5, 4, 6, 0,
  /* 7 */ 2, 5, 0, 3, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0,
  /* 8 */ 0, 6, 2, 3, 3, 3, 3, 0, 2, 0, 2, 0, 4, 4, 4, 0,
  /* 9 */ 2, 6, 0, 4, 4, 4, 4, 0, 2, 5, 2, 0, 0, 5, 0, 0,
  /* a */ 2, 6, 2, 0, 3, 3, 3, 0, 2, 2, 2, 0, 4, 4, 4, 0,
  /* b */ 2, 5, 0, 0, 4, 4, 4, 0, 2, 4, 2, 0, 4, 4, 4, 0,
  /* c */ 2, 6, 0, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0,
  /* d */ 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0,
  /* e */ 2, 6, 0, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0,
  /* f */ 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0
  ]
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502 = function( memory, dbg ) {
  this.dbg    = dbg;
  this.memory = memory;
  this.pc     = 0xc000;
  this.a      = 0x00;
  this.x      = 0x00;
  this.y      = 0x00;
  this.sp     = 0xfd;
  this.status = 0x24;
  this.ticks  = 0;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.reset = function() {
  this.a      = 0x00;
  this.x      = 0x00;
  this.y      = 0x00;
  this.sp     = 0xfd;
  this.status = 0x24;
  this.ticks  = 0; 
  if( configuration.nestestMode ) {
    this.pc = 0xc000;
  } else {
    var l = this.memory.readMemory( 0xfffc );
    var h = this.memory.readMemory( 0xfffd );
    this.pc = ( (h << 8) | l ) & 0xffff;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.triggerInterrupt = function( name ) {
  switch( name ) {
    case interrupt.nmi: { // NMI
      this.stackPush( (this.pc >> 8) & 0xff );
      this.stackPush( this.pc & 0xff );
      this.stackPush( (this.status | 0x20) & 0xff );
      this.status |= FLAG_I;
      var l = this.memory.readMemory( 0xfffa ), h = this.memory.readMemory( 0xfffb );
      this.pc = ( (h << 8) | l ) & 0xffff;
    } break;

    default: {
      configuration.running = false;
      throw 'invalid interrupt < @' + name + ' >';
    } break;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.stackPush = function( value ) {
  this.memory.writeMemory( (this.sp | 0x100) & 0xffff, value );
  this.sp = ( this.sp - 1 ) & 0xff;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.stackPop = function() {
  this.sp = ( this.sp + 1 ) & 0xff;
  return this.memory.readMemory( (this.sp | 0x100) & 0xffff );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.fetch = function() {
  var t = this.pc;
  this.pc = ( this.pc + 1 ) & 0xffff;
  return this.memory.readMemory( t );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.execute = function( opcode ) {
  if( configuration.logTrace ) this.dbg.trace( this, opcode );
  this.ticks = 0;

  var mode = opcodeInfo.mode[ opcode ];
  switch( opcode ) {
    // arithmetic
    case 0x69: case 0x65: case 0x75: case 0x6d: case 0x7d: case 0x79: case 0x61: case 0x71: this.addWithCarry( mode ); break;
    case 0xe9: case 0xe5: case 0xf5: case 0xed: case 0xfd: case 0xf9: case 0xe1: case 0xf1: this.subtractWithCarry( mode ); break;

    // bitwise
    case 0x29: case 0x25: case 0x35: case 0x2d: case 0x3d: case 0x39: case 0x21: case 0x31: this.logicalAnd( mode ); break;
    case 0x09: case 0x05: case 0x15: case 0x0d: case 0x1d: case 0x19: case 0x01: case 0x11: this.logicalOr( mode ); break;
    case 0x49: case 0x45: case 0x55: case 0x4d: case 0x5d: case 0x59: case 0x41: case 0x51: this.logicalXor( mode ); break;

    // branches
    case 0x10: this.branch( FLAG_N, false ); break;
    case 0x30: this.branch( FLAG_N, true ); break;
    case 0x50: this.branch( FLAG_V, false ); break;
    case 0x70: this.branch( FLAG_V, true ); break;
    case 0x90: this.branch( FLAG_C, false ); break;
    case 0xb0: this.branch( FLAG_C, true ); break;
    case 0xd0: this.branch( FLAG_Z, false ); break;
    case 0xf0: this.branch( FLAG_Z, true ); break;

    // compares
    case 0xc9: case 0xc5: case 0xd5: case 0xcd: case 0xdd: case 0xd9: case 0xc1: case 0xd1: this.compare( mode, 'a'); break;
    case 0xc0: case 0xc4: case 0xcc: this.compare( mode, 'y'); break;
    case 0xe0: case 0xe4: case 0xec: this.compare( mode, 'x'); break;

    // flags
    case 0x38: this.flagSet( FLAG_C ); break;
    case 0xf8: this.flagSet( FLAG_D ); break;
    case 0x78: this.flagSet( FLAG_I ); break;
    case 0x18: this.flagReset( FLAG_C ); break;
    case 0xd8: this.flagReset( FLAG_D ); break;
    case 0xb8: this.flagReset( FLAG_V ); break;

    // increments & decrements
    case 0xca: this.decrementRegister('x'); break;
    case 0x88: this.decrementRegister('y'); break;
    case 0xe8: this.incrementRegister('x'); break;
    case 0xc8: this.incrementRegister('y'); break;
    case 0xc6: case 0xd6: case 0xce: case 0xde: this.decrementMemory( mode ); break;
    case 0xe6: case 0xf6: case 0xee: case 0xfe: this.incrementMemory( mode ); break;

    // loads
    case 0xa2: case 0xa6: case 0xb6: case 0xae: case 0xbe: this.load( mode, 'x'); break;
    case 0xa9: case 0xa5: case 0xb5: case 0xad: case 0xbd: case 0xb9: case 0xa1: case 0xb1: this.load( mode, 'a'); break;
    case 0xa0: case 0xa4: case 0xb4: case 0xac: case 0xbc: this.load( mode, 'y'); break;

    // jumps
    case 0x4c: case 0x6c: this.jump( mode ); break;
    case 0x20: this.jumpSubroutine( mode ); break;

    // returns
    case 0x60: this.returnSubroutine(); break;
    case 0x40: this.returnInterrupt(); break;

    // shits & rotates
    case 0x0a: case 0x06: case 0x16: case 0x0e: case 0x1e: this.shiftLeft( mode ); break;
    case 0x4a: case 0x46: case 0x56: case 0x4e: case 0x5e: this.shiftRight( mode ); break;
    case 0x2a: case 0x26: case 0x36: case 0x2e: case 0x3e: this.rotateLeft( mode ); break;
    case 0x6a: case 0x66: case 0x76: case 0x6e: case 0x7e: this.rotateRight( mode ); break;

    // stack
    case 0x08: this.pushStatus(); break;
    case 0x28: this.pullStatus(); break;
    case 0x48: this.pushAccumulator(); break;
    case 0x68: this.pullAccumulator(); break;

    // stores
    case 0x85: case 0x95: case 0x8d: case 0x9d: case 0x99: case 0x81: case 0x91: this.store( mode, 'a'); break;
    case 0x86: case 0x96: case 0x8e: this.store( mode, 'x'); break;
    case 0x84: case 0x94: case 0x8c: this.store( mode, 'y'); break;

    // transfers
    case 0xaa: this.transfer('a', 'x', true ); break;
    case 0xa8: this.transfer('a', 'y', true ); break;
    case 0xba: this.transfer('sp', 'x', true ); break;
    case 0x8a: this.transfer('x', 'a', true ); break;
    case 0x9a: this.transfer('x', 'sp', false ); break;
    case 0x98: this.transfer('y', 'a', true ); break;

    // misc
    case 0xea: break;
    case 0x24: case 0x2c: this.testBits( mode ); break;

    default: {
      configuration.running = false;
      throw 'not implemented opcode';
    } break;
  }

  var t = opcodeInfo.ticks[ opcode ];
  if( ! t ) {
    configuration.running = false;
    throw 'clock cycles not implemented';
  }
  this.ticks += t;

  return this.ticks;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.getAddress = function( mode ) {
  var address = 0;

  switch( mode ) {
    case ABS: {
      var l   = this.fetch(), h = this.fetch();
      address = ( (h << 8) | l ) & 0xffff;
    } break;

    case ABX: case AXN: {
      var l   = this.fetch(), h = this.fetch();
      address = ( ((h << 8) | l) + this.x ) & 0xffff;
      if( (mode === ABX) && (l + this.x > 0xff) ) this.ticks++;
    } break;

    case ABY: case AYN: {
      var l   = this.fetch(), h = this.fetch();
      address = ( ((h << 8) | l) + this.y ) & 0xffff;
      if( (mode === ABY) && (l + this.y > 0xff) ) this.ticks++;
    } break;

    case IMM: {
      address = this.pc;
      this.pc = ( this.pc + 1 ) & 0xffff;
    } break;

    case IND: {
      var r1  = this.fetch(), r2 = this.fetch();
      var l   = this.memory.readMemory( ((r2 << 8) | r1) & 0xffff ), h = this.memory.readMemory( ((r2 << 8) | ((r1 + 1) & 0xff)) & 0xffff );
      address = ( (h << 8) | l ) & 0xffff;
    } break;

    case INX: {
      var r   = ( this.fetch() + this.x ) & 0xff;
      var l   = this.memory.readMemory( r ), h = this.memory.readMemory( (r + 1) & 0xff );
      address = ( (h << 8) | l ) & 0xffff;
    } break;

    case INY: case IYN: {
      var r   = this.fetch();
      var l   = this.memory.readMemory( r ), h = this.memory.readMemory( (r + 1) & 0xff );
      address = ( ((h << 8) | l) + this.y ) & 0xffff;
      if( (mode === INY) && (l + this.y > 0xff) ) this.ticks++;
    } break;

    case ZEP: {
      address = this.fetch();
    } break;

    case ZPX: {
      address = ( this.fetch() + this.x ) & 0xff;
    } break;

    case ZPY: {
      address = ( this.fetch() + this.y ) & 0xff;
    } break;

    default: {
      configuration.running = false;
      throw 'invalid addressing mode < ' + this.pc.toHex(4) + ' @' + mode + ' >';
    } break;
  }

  return address;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.addWithCarry = function( mode ) {
  var src   = this.memory.readMemory( this.getAddress(mode) );
  var carry = ( (this.status & FLAG_C) === FLAG_C ) ? 1 : 0;
  var t     = ( this.a + src + carry ) & 0xffff;
  this.status &= ~( FLAG_C | FLAG_Z | FLAG_V | FLAG_N );
  if( t > 0xff ) this.status |= FLAG_C;
  t &= 0xff;
  var c1 = ( ((this.a ^ src) & 0x80) === 0x80 );
  var c2 = ( ((this.a ^ t) & 0x80) === 0x80 );
  if( (! c1) && c2 ) this.status |= FLAG_V;
  this.a = t;
  this.status |= ZN[ this.a ];
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.branch = function( flag, value ) {
  var disp = this.fetch();
  if( ((this.status & flag) === flag) === value ) {
    if( (disp & 0x80) === 0x80 ) disp -= 0x100;
    this.ticks++;
    var before = ( this.pc >> 8 ) & 0xff;
    this.pc = ( this.pc + disp ) & 0xffff;
    if( ((this.pc >> 8) & 0xff) !== before ) this.ticks++;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.compare = function( mode, reg ) {
  var t = this.memory.readMemory( this.getAddress(mode) );
  this.status &= ~( FLAG_C | FLAG_Z | FLAG_N );
  if( this[reg] >= t ) this.status |= FLAG_C;
  t = ( this[reg] - t ) & 0xff;
  this.status |= ZN[ t ];
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.decrementMemory = function( mode ) {
  var address = this.getAddress( mode );
  var t       = ( this.memory.readMemory(address) - 1 ) & 0xff;
  this.status &= ~( FLAG_Z | FLAG_N );
  this.status |= ZN[ t ];
  this.memory.writeMemory( address, t );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.decrementRegister = function( reg ) {
  this[ reg ] = ( this[reg] - 1 ) & 0xff;
  this.status &= ~( FLAG_Z | FLAG_N );
  this.status |= ZN[ this[reg] ];
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.flagReset = function( flag ) {
  this.status &= ~flag;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.flagSet = function( flag ) {
  this.status |= flag;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.incrementMemory = function( mode ) {
  var address = this.getAddress( mode );
  var t       = ( this.memory.readMemory(address) + 1 ) & 0xff;
  this.status &= ~( FLAG_Z | FLAG_N );
  this.status |= ZN[ t ];
  this.memory.writeMemory( address, t );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.incrementRegister = function( reg ) {
  this[ reg ] = ( this[reg] + 1 ) & 0xff;
  this.status &= ~( FLAG_Z | FLAG_N );
  this.status |= ZN[ this[reg] ];
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.jump = function( mode ) {
  this.pc = this.getAddress( mode );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.jumpSubroutine = function( mode ) {
  var address = this.getAddress( mode );
  var t = ( (this.pc - 1) & 0xffff );
  this.stackPush( (t >> 8) & 0xff );
  this.stackPush( t & 0xff );
  this.pc = address;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.load = function( mode, reg ) {
  this[ reg ] = this.memory.readMemory( this.getAddress(mode) );
  this.status &= ~( FLAG_Z | FLAG_N );
  this.status |= ZN[ this[reg] ];
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.logicalAnd = function( mode ) {
  this.a &= this.memory.readMemory( this.getAddress(mode) );
  this.status &= ~( FLAG_Z | FLAG_N );
  this.status |= ZN[ this.a ];
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.logicalOr = function( mode ) {
  this.a |= this.memory.readMemory( this.getAddress(mode) );
  this.status &= ~( FLAG_Z | FLAG_N );
  this.status |= ZN[ this.a ];
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.logicalXor = function( mode ) {
  this.a ^= this.memory.readMemory( this.getAddress(mode) );
  this.status &= ~( FLAG_Z | FLAG_N );
  this.status |= ZN[ this.a ];
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.pushAccumulator = function() {
  this.stackPush( this.a );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.pushStatus = function() {
  this.stackPush( (this.status | 0x30) & 0xff );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.pullAccumulator = function() {
  this.a = this.stackPop();
  this.status &= ~( FLAG_Z | FLAG_N );
  this.status |= ZN[ this.a ];
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.pullStatus = function() {
  this.status = this.stackPop();
  this.status &= ~FLAG_B;
  this.status |= FLAG_P;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.returnInterrupt = function() {
  this.status = this.stackPop();
  this.status &= ~FLAG_B;
  this.status |= FLAG_P;
  var l = this.stackPop();
  var h = this.stackPop();
  this.pc = ( (h << 8) | l ) & 0xffff;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.returnSubroutine = function() {
  var l = this.stackPop(), h = this.stackPop();
  this.pc = ( (h << 8) | l ) & 0xffff;
  this.pc = ( this.pc + 1 ) & 0xffff;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.rotateLeft = function( mode ) {
  var address  = ( (mode !== ACC) ? this.getAddress(mode) : null );
  var t        = ( (mode !== ACC) ? this.memory.readMemory(address) : this.a );
  var oldCarry = ( (this.status & FLAG_C) === FLAG_C ? 0x1 : 0 );
  var newCarry = ( (t & 0x80) === 0x80 ? true : false );
  this.status &= ~( FLAG_C | FLAG_Z | FLAG_N );
  if( newCarry ) this.status |= FLAG_C;
  t = ( ((t << 1) & 0xfe) | oldCarry ) & 0xff;
  this.status |= ZN [ t ];
  if( mode !== ACC ) this.memory.writeMemory( address, t ); else this.a = t;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.rotateRight = function( mode ) {
  var address  = ( (mode !== ACC) ? this.getAddress(mode) : null );
  var t        = ( (mode !== ACC) ? this.memory.readMemory(address) : this.a );
  var oldCarry = ( (this.status & FLAG_C) === FLAG_C ? 0x80 : 0 );
  var newCarry = ( (t & 0x1) === 0x1 ? true : false );
  this.status &= ~( FLAG_C | FLAG_Z | FLAG_N );
  if( newCarry ) this.status |= FLAG_C;
  t = ( ((t >> 1) & 0x7f) | oldCarry ) & 0xff;
  this.status |= ZN [ t ];
  if( mode !== ACC ) this.memory.writeMemory( address, t ); else this.a = t;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.shiftLeft = function( mode ) {
  var address  = ( (mode !== ACC) ? this.getAddress(mode) : null );
  var t        = ( (mode !== ACC) ? this.memory.readMemory(address) : this.a );
  var newCarry = ( (t & 0x80) === 0x80 ? true : false );
  this.status &= ~( FLAG_C | FLAG_Z | FLAG_N );
  if( newCarry ) this.status |= FLAG_C;
  t = ( t << 1 ) & 0xfe;
  this.status |= ZN[ t ];
  if( mode !== ACC ) this.memory.writeMemory( address, t ); else this.a = t;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.shiftRight = function( mode ) {
  var address  = ( (mode !== ACC) ? this.getAddress(mode) : null );
  var t        = ( (mode !== ACC) ? this.memory.readMemory(address) : this.a );
  var newCarry = ( (t & 0x1) === 0x1 ? true : false );
  this.status &= ~( FLAG_C | FLAG_Z | FLAG_N );
  if( newCarry ) this.status |= FLAG_C;
  t = ( t >> 1 ) & 0x7f;
  this.status |= ZN[ t ];
  if( mode !== ACC ) this.memory.writeMemory( address, t ); else this.a = t;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.store = function( mode, reg ) {
  this.memory.writeMemory( this.getAddress(mode), this[reg] );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.subtractWithCarry = function( mode ) {
  var src   = this.memory.readMemory( this.getAddress(mode) );
  var carry = ( (this.status & FLAG_C) !== FLAG_C ) ? 1 : 0;
  var t     = ( this.a - src - carry ) & 0xffff;
  this.status &= ~( FLAG_C | FLAG_Z | FLAG_V | FLAG_N );
  if( t < 0x100 ) this.status |= FLAG_C;
  t &= 0xff;
  var c1 = ( ((this.a ^ src) & 0x80) === 0x80 );
  var c2 = ( ((this.a ^ t) & 0x80) === 0x80 );
  if( c1 && c2 ) this.status |= FLAG_V;
  this.a = t;
  this.status |= ZN[ this.a ];
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.testBits = function( mode ) {
  var t = this.memory.readMemory( this.getAddress(mode) );
  this.status &= ~( FLAG_Z | FLAG_V | FLAG_N );
  if( (this.a & t) === 0 ) this.status |= FLAG_Z;
  this.status |= ( t & (FLAG_N | FLAG_V) );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.M6502.prototype.transfer = function( from, to, doFlags ) {
  this[ to ] = this[ from ];
  if( doFlags ) {
    this.status &= ~( FLAG_Z | FLAG_N );
    this.status |= ZN[ this[to] ]
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
