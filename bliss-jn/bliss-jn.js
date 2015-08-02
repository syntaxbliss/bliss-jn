////////////////////////////////////////////////////////////////////////////////////////////////////

Object.prototype.toHex = function( size ) {
    var str = this.toString( 16 );
    while( str.length < size ) str = '0' + str;
    return str.toUpperCase();
}

////////////////////////////////////////////////////////////////////////////////////////////////////

var FLAG_N = 0x80;
var FLAG_V = 0x40;
var FLAG_P = 0x20;
var FLAG_B = 0x10;
var FLAG_D = 0x8;
var FLAG_I = 0x4;
var FLAG_Z = 0x2;
var FLAG_C = 0x1;

var ZN_FLAGS = [
//           0       1       2       3       4       5       6       7       8       9       a       b       c       d       e       f
/* 0 */ FLAG_Z,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
/* 1 */      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
/* 2 */      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
/* 3 */      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
/* 4 */      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
/* 5 */      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
/* 6 */      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
/* 7 */      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,      0,
/* 8 */ FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
/* 9 */ FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
/* a */ FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
/* b */ FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
/* c */ FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
/* d */ FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
/* e */ FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N,
/* f */ FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N, FLAG_N
];

var ABS = 1;
var ABX = 2;
var ABY = 3;
var ACC = 4;
var AXN = 5;
var AYN = 6;
var IMM = 7;
var IMP = 8;
var IND = 9;
var INX = 10;
var INY = 11;
var IYN = 12;
var REL = 13;
var ZEP = 14;
var ZPX = 15;
var ZPY = 16;

var OPCODE_OPERATION = [
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
];

var OPCODE_MODE = [
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
];

var OPCODE_CYCLES = [
//      0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
/* 0 */ 0, 6, 0, 0, 0, 3, 5, 0, 3, 2, 2, 0, 0, 4, 6, 0,
/* 1 */ 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0,
/* 2 */ 6, 6, 0, 0, 3, 3, 5, 0, 4, 2, 2, 0, 4, 4, 6, 0,
/* 3 */ 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0,
/* 4 */ 6, 6, 0, 0, 0, 3, 5, 0, 3, 2, 2, 0, 3, 4, 6, 0,
/* 5 */ 2, 5, 0, 0, 0, 4, 6, 0, 0, 4, 0, 0, 0, 4, 7, 0,
/* 6 */ 6, 6, 0, 0, 0, 3, 5, 0, 4, 2, 2, 0, 5, 4, 6, 0,
/* 7 */ 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0,
/* 8 */ 0, 6, 0, 0, 3, 3, 3, 0, 2, 0, 2, 0, 4, 4, 4, 0,
/* 9 */ 2, 6, 0, 0, 4, 4, 4, 0, 2, 5, 2, 0, 0, 5, 0, 0,
/* a */ 2, 6, 2, 0, 3, 3, 3, 0, 2, 2, 2, 0, 4, 4, 4, 0,
/* b */ 2, 5, 0, 0, 4, 4, 4, 0, 2, 4, 2, 0, 4, 4, 4, 0,
/* c */ 2, 6, 0, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0,
/* d */ 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0,
/* e */ 2, 6, 0, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0,
/* f */ 2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0
];

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN = function( args ) {
    this.target = args.target;
    this.nes    = new BlissJN.NES( args.gameData, args.target );
}

BlissJN.prototype = {}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.NES = function( data, target ) {
    this.mmu   = new BlissJN.NES.MMU( data );
    this.m6502 = new BlissJN.NES.M6502( this.mmu, target );
    this.start();
}

BlissJN.NES.prototype = {
    start : function() {
        var cycles = 0;
        for( var i = 0; i < 6000; i++ ) {
            var opcode = this.m6502.fetch();
            var c = this.m6502.execute( opcode );
            if( c === 0 ) throw "error: no se definieron los ciclos para el opcode < " + opcode.toHex(2) + " >";
            cycles += c;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.NES.MMU = function( data ) {
    this.rom  = [];
    this.vram = [];
    this.sram = [];

    for( var i = 0; i < 0x10000; i++ ) this.rom.push( 0x00 );
    for( var i = 0; i < 0x4000; i++ ) this.vram.push( 0x00 );
    for( var i = 0; i < 0x100; i++ ) this.sram.push( 0x00 );

    this.allocate( data );
}

BlissJN.NES.MMU.prototype = {
    allocate : function( data ) {
        var romBanks = data[ 4 ];
        var index = 0;
        if( romBanks === 1 ) {
            for( var i = 0; i < 0x4000; i++ ) this.rom[ 0x8000 + i ] = this.rom[ 0xc000 + i ] = data[ 16 + index++ ];
        } else if( romBanks === 2 ) {
            for( var i = 0; i < 0x8000; i++ ) this.rom[ 0x8000 + i ] = data[ 16 + index++ ];
        } else {
            throw "error: demasiados bancos de memoria PRG-ROM";
        }
        for( var i = 0; i < 0x2000; i++ ) this.vram[ i ] = data[ 16 + index++ ];
    },

    readByte : function( address ) {
        return this.rom[ address ];
    },

    writeByte : function( address, value ) {
        this.rom[ address ] = value;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.NES.M6502 = function( mmu, target ) {
    this.debugger = new BlissJN.NES.M6502.Debugger( target );
    this.mmu      = mmu;
    this.pc       = 0xc000;
    this.a        = 0x00;
    this.x        = 0x00;
    this.y        = 0x00;
    this.sp       = 0xfd;
    this.status   = 0x24;
    this.ticks    = 0;
}

BlissJN.NES.M6502.prototype = {
    getContext : function() {
        return {
            mmu    : this.mmu,
            pc     : ( this.pc - 1 ) & 0xffff,
            a      : this.a,
            x      : this.x,
            y      : this.y,
            sp     : this.sp,
            status : this.status,
            ticks  : this.ticks
        };
    },

    fetch : function() {
        var address = this.pc;
        this.pc = ( this.pc + 1 ) & 0xffff;
        return this.mmu.readByte( address );
    },

    execute : function( opcode ) {
        this.debugger.trace( this.getContext(), opcode );
        this.ticks = 0;
        var operation = OPCODE_OPERATION[ opcode ];
        this[ operation ]( OPCODE_MODE[opcode] );
        this.ticks += OPCODE_CYCLES[ opcode ];
        return this.ticks;
    },

    stackPush : function( value ) {
        this.mmu.writeByte( (this.sp | 0x0100) & 0xffff, value );
        this.sp = ( this.sp - 1 ) & 0xff;
    },

    stackPop : function( value ) {
        this.sp = ( this.sp + 1 ) & 0xff;
        return this.mmu.readByte( (this.sp | 0x0100) & 0xffff );
    },

    getAddress : function( mode ) {
        var address = null;

        switch( mode ) {
            case ABS: {
                var l = this.fetch(), h = this.fetch();
                address = ( (h << 8) | l ) & 0xffff;
            } break;

            case ABX: { // TODO: page-crossing
                var l = this.fetch(), h = this.fetch();
                address = ( ((h << 8) | l) + this.x ) & 0xffff;
            } break;

            case ABY: { // TODO: page-crossing
                var l = this.fetch(), h = this.fetch();
                address = ( ((h << 8) | l) + this.y ) & 0xffff;
            } break;

            case AXN: {
                var l = this.fetch(), h = this.fetch();
                address = ( ((h << 8) | l) + this.x ) & 0xffff;
            } break;

            case AYN: {
                var l = this.fetch(), h = this.fetch();
                address = ( ((h << 8) | l) + this.y ) & 0xffff;
            } break;

            case IMM: {
                address = this.pc;
                this.pc = ( this.pc + 1 ) & 0xffff;
            } break;

            case IND: {
                var l  = this.fetch(), h = this.fetch();
                var rl = this.mmu.readByte( ((h << 8) | l) & 0xffff ), rh = this.mmu.readByte( ((h << 8) | ((l + 1) & 0xff)) & 0xffff );
                address = ( (rh << 8) | rl ) & 0xffff;
            } break;

            case INX: {
                var r = ( this.fetch() + this.x ) & 0xff;
                var l = this.mmu.readByte( r ), h = this.mmu.readByte( (r + 1) & 0xff );
                address = ( (h << 8) | l ) & 0xffff;
            } break;

            case IYN: // TODO: page-crossing
            case INY: {
                var r = this.fetch();
                var l = this.mmu.readByte( r ), h = this.mmu.readByte( (r + 1) & 0xff );
                address = ( ((h << 8) | l) + this.y ) & 0xffff;
            } break;

            case IMP: {
                address = this.pc;
            } break;

            case ZEP: case REL: {
                address = this.fetch();
            } break;

            case ZPX: {
                address = ( this.fetch() + this.x ) & 0xff;
            } break;

            case ZPY: {
                address = ( this.fetch() + this.y ) & 0xff;
            } break;

            default: {
                throw "error: < " + mode + " > no es un modo de direccionamiento valido";
            } break;
        };

        return address;
    },

    ADC : function( mode ) {
        var src   = this.mmu.readByte( this.getAddress(mode) );
        var carry = ( (this.status & FLAG_C) === FLAG_C ) ? 1 : 0;
        var r     = ( this.a + src + carry ) & 0xffff;
        this.status &= ~( FLAG_C | FLAG_Z | FLAG_V | FLAG_N );
        if( r > 0x00ff ) this.status |= FLAG_C;
        r &= 0xff;
        var c1 = ( (this.a ^ src) & 0x80 ) === 0x80;
        var c2 = ( (this.a ^ r) & 0x80 ) === 0x80;
        if( (!c1) && c2 ) this.status |= FLAG_V;
        this.a = r;
        this.status |= ZN_FLAGS[ this.a ];
    },

    AND : function( mode ) {
        this.a &= this.mmu.readByte( this.getAddress(mode) );
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.a ];
    },

    ASL : function( mode ) {
        var address = null, src = this.a;
        if( mode !== ACC ) {
            address = this.getAddress( mode );
            src = this.mmu.readByte( address );
        }
        var carry = ( src & 0x80 ) === 0x80;
        var r = ( src << 1 ) & 0xfe;
        this.status &= ~( FLAG_C | FLAG_Z | FLAG_N );
        if( carry ) this.status |= FLAG_C;
        this.status |= ZN_FLAGS[ r ];
        if( mode !== ACC ) this.mmu.writeByte( address, r ); else this.a = r;
    },

    BCC : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_C) !== FLAG_C ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.pc = ( this.pc + offset ) & 0xffff;
        }
    },

    BCS : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_C) === FLAG_C ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.pc = ( this.pc + offset ) & 0xffff;
        }
    },

    BEQ : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_Z) === FLAG_Z ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.pc = ( this.pc + offset ) & 0xffff;
        }
    },

    BIT : function( mode ) {
        var mask = this.mmu.readByte( this.getAddress(mode) );
        var r = ( this.a & mask ) & 0xff;
        this.status &= ~( FLAG_Z | FLAG_V | FLAG_N );
        if( r === 0 ) this.status |= FLAG_Z;
        this.status |= ( mask & 0xc0 ) & 0xff;
    },

    BNE : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_Z) !== FLAG_Z ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.pc = ( this.pc + offset ) & 0xffff;
        }
    },

    BPL : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_N) !== FLAG_N ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.pc = ( this.pc + offset ) & 0xffff;
        }
    },

    BMI : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_N) === FLAG_N ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.pc = ( this.pc + offset ) & 0xffff;
        }
    },

    BVC : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_V) !== FLAG_V ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.pc = ( this.pc + offset ) & 0xffff;
        }
    },

    BVS : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_V) === FLAG_V ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.pc = ( this.pc + offset ) & 0xffff;
        }
    },

    CLC : function( mode ) {
        this.status &= ~FLAG_C;
    },

    CLD : function( mode ) {
        this.status &= ~FLAG_D;
    },

    CLV : function( mode ) {
        this.status &= ~FLAG_V;
    },

    CMP : function( mode ) {
        var src = this.mmu.readByte( this.getAddress(mode) );
        this.status &= ~( FLAG_C | FLAG_Z | FLAG_N );
        if( this.a >= src ) this.status |= FLAG_C;
        src = ( this.a - src ) & 0xff;
        this.status |= ZN_FLAGS[ src ];
    },

    CPX : function( mode ) {
        var src = this.mmu.readByte( this.getAddress(mode) );
        this.status &= ~( FLAG_C | FLAG_Z | FLAG_N );
        if( this.x >= src ) this.status |= FLAG_C;
        src = ( this.x - src ) & 0xff;
        this.status |= ZN_FLAGS[ src ];
    },

    CPY : function( mode ) {
        var src = this.mmu.readByte( this.getAddress(mode) );
        this.status &= ~( FLAG_C | FLAG_Z | FLAG_N );
        if( this.y >= src ) this.status |= FLAG_C;
        src = ( this.y - src ) & 0xff;
        this.status |= ZN_FLAGS[ src ];
    },

    DEC : function( mode ) {
        var address = this.getAddress( mode );
        var r       = ( this.mmu.readByte(address) - 1 ) & 0xff;
        this.mmu.writeByte( address, r );
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ r ];
    },

    DEX : function( mode ) {
        this.x = ( this.x - 1 ) & 0xff;
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.x ];
    },

    DEY : function( mode ) {
        this.y = ( this.y - 1 ) & 0xff;
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.y ];
    },

    EOR : function( mode ) {
        this.a ^= this.mmu.readByte( this.getAddress(mode) );
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.a ];
    },

    INC : function( mode ) {
        var address = this.getAddress( mode );
        var r       = ( this.mmu.readByte(address) + 1 ) & 0xff;
        this.mmu.writeByte( address, r );
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ r ];
    },

    INX : function( mode ) {
        this.x = ( this.x + 1 ) & 0xff;
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.x ];
    },

    INY : function( mode ) {
        this.y = ( this.y + 1 ) & 0xff;
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.y ];
    },

    JMP : function( mode ) {
        this.pc = this.getAddress( mode );
    },

    JSR : function( mode ) {
        var address = this.getAddress( mode );
        var pc = ( this.pc - 1 ) & 0xffff;
        this.stackPush( (pc >> 8) & 0xff );
        this.stackPush( pc & 0xff );
        this.pc = address;
    },

    LDA : function( mode ) {
        this.a = this.mmu.readByte( this.getAddress(mode) );
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.a ];
    },

    LDX : function( mode ) {
        this.x = this.mmu.readByte( this.getAddress(mode) );
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.x ];
    },

    LDY : function( mode ) {
        this.y = this.mmu.readByte( this.getAddress(mode) );
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.y ];
    },

    LSR : function( mode ) {
        var address = null, src = this.a;
        if( mode !== ACC ) {
            address = this.getAddress( mode );
            src = this.mmu.readByte( address );
        }
        var carry = ( src & 0x1 ) === 0x1;
        var r = ( src >> 1 ) & 0x7f;
        this.status &= ~( FLAG_C | FLAG_Z | FLAG_N );
        if( carry ) this.status |= FLAG_C;
        this.status |= ZN_FLAGS[ r ];
        if( mode !== ACC ) this.mmu.writeByte( address, r ); else this.a = r;
    },

    NOP : function( mode ) {},

    ORA : function( mode ) {
        this.a |= this.mmu.readByte( this.getAddress(mode) );
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.a ];
    },

    PHA : function( mode ) {
        this.stackPush( this.a );
    },

    PHP : function( mode ) {
        this.stackPush( (this.status | 0x30) & 0xff );
    },

    PLA : function( mode ) {
        this.a = this.stackPop();
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.a ];
    },

    PLP : function( mode ) {
        this.status = this.stackPop();
        this.status &= ~FLAG_B;
        this.status |= FLAG_P;
    },

    ROL : function( mode ) {
        var address = null, src = this.a;
        if( mode !== ACC ) {
            address = this.getAddress( mode );
            src = this.mmu.readByte( address );
        }
        var old   = ( (this.status & FLAG_C) === FLAG_C ) ? 0x1 : 0;
        var carry = ( src & 0x80 ) === 0x80;
        var r = ( ((src << 1) & 0xfe) | old ) & 0xff;
        this.status &= ~( FLAG_C | FLAG_Z | FLAG_N );
        if( carry ) this.status |= FLAG_C;
        this.status |= ZN_FLAGS[ r ];
        if( mode !== ACC ) this.mmu.writeByte( address, r ); else this.a = r;
    },

    ROR : function( mode ) {
        var address = null, src = this.a;
        if( mode !== ACC ) {
            address = this.getAddress( mode );
            src = this.mmu.readByte( address );
        }
        var old   = ( (this.status & FLAG_C) === FLAG_C ) ? 0x80 : 0;
        var carry = ( src & 0x1 ) === 0x1;
        var r = ( ((src >> 1) & 0x7f) | old ) & 0xff;
        this.status &= ~( FLAG_C | FLAG_Z | FLAG_N );
        if( carry ) this.status |= FLAG_C;
        this.status |= ZN_FLAGS[ r ];
        if( mode !== ACC ) this.mmu.writeByte( address, r ); else this.a = r;
    },

    RTI : function( mode ) {
        this.status = this.stackPop();
        this.status &= ~FLAG_B;
        this.status |= FLAG_P;
        var l = this.stackPop();
        var h = this.stackPop();
        this.pc = ( (h << 8) | l ) & 0xffff;
    },

    RTS : function( mode ) {
        var l = this.stackPop();
        var h = this.stackPop();
        var address = ( (h << 8) | l ) & 0xffff;
        this.pc = ( address + 1 ) & 0xffff;
    },

    SBC : function( mode ) {
        var src   = this.mmu.readByte( this.getAddress(mode) );
        var carry = ( (this.status & FLAG_C) !== FLAG_C ) ? 1 : 0;
        var r     = ( this.a - src - carry ) & 0xffff;
        this.status &= ~( FLAG_C | FLAG_Z | FLAG_V | FLAG_N );
        if( r < 0x0100 ) this.status |= FLAG_C;
        r &= 0xff;
        var c1 = ( (this.a ^ src) & 0x80 ) === 0x80;
        var c2 = ( (this.a ^ r) & 0x80 ) === 0x80;
        if( c1 && c2 ) this.status |= FLAG_V;
        this.a = r;
        this.status |= ZN_FLAGS[ this.a ];
    },

    SEC : function( mode ) {
        this.status |= FLAG_C;
    },

    SED : function( mode ) {
        this.status |= FLAG_D;
    },

    SEI : function( mode ) {
        this.status |= FLAG_I;
    },

    STA : function( mode ) {
        this.mmu.writeByte( this.getAddress(mode), this.a );
    },

    STX : function( mode ) {
        this.mmu.writeByte( this.getAddress(mode), this.x );
    },

    STY : function( mode ) {
        this.mmu.writeByte( this.getAddress(mode), this.y );
    },

    TAX : function( mode ) {
        this.x = this.a;
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.x ];
    },

    TAY : function( mode ) {
        this.y = this.a;
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.y ];
    },

    TSX : function( mode ) {
        this.x = this.sp;
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.x ];
    },

    TXA : function( mode ) {
        this.a = this.x;
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.a ];
    },

    TXS : function( mode ) {
        this.sp = this.x;
    },

    TYA : function( mode ) {
        this.a = this.y;
        this.status &= ~( FLAG_Z | FLAG_N );
        this.status |= ZN_FLAGS[ this.a ];
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.NES.M6502.Debugger = function( target ) {
    this.target  = target;
    this.context = null;
};

BlissJN.NES.M6502.Debugger.prototype = {
    trace : function( context, opcode ) {
        this.context = context;
        var str = context.pc.toHex(4) + "  " + opcode.toHex(2) + " " + this.operands( OPCODE_MODE[opcode] ) + "  " + this.explain( opcode ) + this.registers();
        this.renderString( str );
    },

    peek : function( n ) {
        return this.context.mmu.readByte( (this.context.pc + n) & 0xffff );
    },

    operands : function( mode ) {
        var str = null;
        switch( mode ) {
            case ABS: case ABX: case ABY: case AXN: case AYN: case IND: {
                str = this.peek(1).toHex(2) + " " + this.peek(2).toHex(2);
            } break;

            case IMM: case INX: case INY: case IYN: case REL: case ZEP: case ZPX: case ZPY: {
                str = this.peek(1).toHex(2) + "   ";
            } break;

            case ACC: case IMP: {
                str = '     '
            } break;
        }
        return str;
    },

    explain : function( opcode ) {
        var name = OPCODE_OPERATION[ opcode ], mode = OPCODE_MODE[ opcode ], str = '';
        str = name + ' ';
        switch( mode ) {
            case ABS: {
                var l = this.peek(1), h = this.peek(2), address = ( (h << 8) | l ) & 0xffff;
                str += '$' + address.toHex(4);
                if(['JMP', 'JSR'].indexOf(name) === -1 ) str += ' = ' + this.context.mmu.readByte( address ).toHex(2) + '                  ';
                else str += '                       ';
            } break;

            case ABX: { // TODO: page-crossing
                var l = this.peek(1), h = this.peek(2), address = ( (h << 8) | l ) & 0xffff, disp = ( address + this.context.x ) & 0xffff;
                str += '$' + address.toHex(4) + ',X @ ' + disp.toHex(4) + ' = ' + this.context.mmu.readByte( disp ).toHex(2) + '         ';
            } break;

            case ABY: { // TODO: page-crossing
                var l = this.peek(1), h = this.peek(2), address = ( (h << 8) | l ) & 0xffff, disp = ( address + this.context.y ) & 0xffff;
                str += '$' + address.toHex(4) + ',Y @ ' + disp.toHex(4) + ' = ' + this.context.mmu.readByte( disp ).toHex(2) + '         ';
            } break;

            case AXN: {
                var l = this.peek(1), h = this.peek(2), address = ( (h << 8) | l ) & 0xffff, disp = ( address + this.context.x ) & 0xffff;
                str += '$' + address.toHex(4) + ',X @ ' + disp.toHex(4) + ' = ' + this.context.mmu.readByte( disp ).toHex(2) + '         ';
            } break;

            case AYN: {
                var l = this.peek(1), h = this.peek(2), address = ( (h << 8) | l ) & 0xffff, disp = ( address + this.context.y ) & 0xffff;
                str += '$' + address.toHex(4) + ',Y @ ' + disp.toHex(4) + ' = ' + this.context.mmu.readByte( disp ).toHex(2) + '         ';
            } break;

            case ACC: {
                str += 'A                           ';
            } break;

            case IMM: {
                str += '#$' + this.peek(1).toHex(2);
                str += '                        ';
            } break;

            case IND: {
                var l = this.peek(1), h = this.peek(2), address = ( (h << 8) | l ) & 0xffff;
                var rl = this.context.mmu.readByte( address ), rh = this.context.mmu.readByte( (address + 1) & 0xffff );
                str += '($' + address.toHex(4) + ') = ' + ( (rh << 8) | rl ).toHex(4) + '              ';
            } break;

            case INX: {
                var r = this.peek(1), disp = ( r + this.context.x ) & 0xff;
                var l = this.context.mmu.readByte( disp ), h = this.context.mmu.readByte( (disp + 1) & 0xff );
                var address = ( (h << 8) | l ) & 0xffff, data = this.context.mmu.readByte( address );
                str += '($' + r.toHex(2) + ',X) @ ' + disp.toHex(2) + ' = ' + address.toHex(4) + ' = ' + data.toHex(2) + '    ';
            } break;

            case IYN: // TODO: page-crossing
            case INY: {
                var r = this.peek(1), l = this.context.mmu.readByte( r ), h = this.context.mmu.readByte( (r + 1) & 0xff );
                var address = ( (h << 8) | l ) & 0xffff, disp = ( address + this.context.y ) & 0xffff, data = this.context.mmu.readByte( disp );
                str += '($' + r.toHex(2) + '),Y = ' + address.toHex(4) + ' @ ' + disp.toHex(4) + ' = ' + data.toHex(2) + '  ';
            } break;

            case IMP: {
                str += '                            ';
            } break;

            case REL: {
                var offset = this.peek(1);
                str += '$' + ( (this.context.pc + 2 + offset) & 0xffff ).toHex(4);
                str += '                       ';
            } break;

            case ZEP: {
                str += '$' + this.peek(1).toHex(2) + " = " + this.context.mmu.readByte( this.peek(1) ).toHex(2);
                str += '                    ';
            } break;

            case ZPX: {
                var r = this.peek(1), disp = ( r + this.context.x ) & 0xff;
                str += '$' + r.toHex(2) + ',X @ ' + disp.toHex(2) + ' = ' + this.context.mmu.readByte( disp ).toHex(2) + '             ';
            } break;

            case ZPY: {
                var r = this.peek(1), disp = ( r + this.context.y ) & 0xff;
                str += '$' + r.toHex(2) + ',Y @ ' + disp.toHex(2) + ' = ' + this.context.mmu.readByte( disp ).toHex(2) + '             ';
            } break;
        }
        return str;
    },

    registers : function() {
        var a = [];
        a.push('A:' + this.context.a.toHex(2) );
        a.push('X:' + this.context.x.toHex(2) );
        a.push('Y:' + this.context.y.toHex(2) );
        a.push('P:' + this.context.status.toHex(2) );
        a.push('SP:' + this.context.sp.toHex(2) );
        return a.join(' ');
    },

    renderString : function( string ) {
        var e = document.createElement('pre');
        e.innerHTML = string;
        this.target.appendChild( e );
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
