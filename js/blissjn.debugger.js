////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.Debugger = function( target ) {
  this.context = null;
  this.target = $( target );
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.Debugger.prototype.trace = function( context, opcode ) {
  this.context = context;
  var str = ( (context.pc - 1) & 0xffff ).toHex(4).toLength(6)
    + opcode.toHex(2).toLength(3)
    + this.operands( opcode ).toLength(7)
    + this.explain( opcode ).toLength(32)
    + this.status();

  this.output( str );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.Debugger.prototype.operands = function( opcode ) {
  var mode = opcodeInfo.mode[ opcode ];
  if( mode === null ) {
    configuration.running = false;
    throw 'addressing mode not definded < ' + ((this.context.pc - 1) & 0xffff).toHex(4) + ':' + opcode.toHex(2) + ' >';
    return;
  }

  switch( mode ) {
    case ABS: case ABX: case AXN: case ABY: case AYN: case IND: return this.peek(1).toHex(2) + ' ' + this.peek(2).toHex(2); break;
    case ACC: case IMP: return ''; break;
    case IMM: case INX: case INY: case IYN: case REL: case ZEP: case ZPX: case ZPY: return this.peek(1).toHex(2); break;

    default: {
      configuration.running = false;
      throw 'addressing mode not implemented < ' + ((this.context.pc - 1) & 0xffff).toHex(4) + ':' + opcode.toHex(2) + ' @' + mode + ' >';
    } break;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.Debugger.prototype.explain = function( opcode ) {
  var name = opcodeInfo.name[ opcode ];
  if( name === null ) {
    configuration.running = false;
    throw 'opcode name not definded < ' + ((this.context.pc - 1) & 0xffff).toHex(4) + ':' + opcode.toHex(2) + ' >';
    return;
  }

  var r    = name + ' ';
  var mode = opcodeInfo.mode[ opcode ];
  switch( mode ) {
    case ABS: {
      var op1 = this.peek(1), op2 = this.peek(2);
      r += '$' + op2.toHex(2) + op1.toHex(2);
      if( ['JMP', 'JSR'].indexOf(name) === -1 ) r += ' = ' + this.context.memory.readRam( ((op2 << 8) | op1) & 0xffff ).toHex(2);
    } break;

    case ABX: case AXN: {
      var op1   = this.peek(1), op2 = this.peek(2);
      var index = ( ((op2 << 8) | op1) + this.context.x ) & 0xffff;
      r += '$' + op2.toHex(2) + op1.toHex(2) + ',X @ ' + index.toHex(4) + ' = ' + this.context.memory.readRam( index ).toHex(2);
    } break;

    case ABY: case AYN: {
      var op1   = this.peek(1), op2 = this.peek(2);
      var index = ( ((op2 << 8) | op1) + this.context.y ) & 0xffff;
      r += '$' + op2.toHex(2) + op1.toHex(2) + ',Y @ ' + index.toHex(4) + ' = ' + this.context.memory.readRam( index ).toHex(2);
    } break;

    case ACC: {
      r += 'A';
    } break;

    case IMM: {
      r += '#$' + this.peek(1).toHex(2);
    } break;

    case IMP: {} break;

    case IND: {
      var op1     = this.peek(1), op2 = this.peek(2);
      var l       = this.context.memory.readRam( ((op2 << 8) | op1) & 0xffff ), h = this.context.memory.readRam( (((op2 << 8) | op1) + 1) & 0xffff );
      var address = ( (h << 8) | l ) & 0xffff;
      r += '($' + op2.toHex(2) + op1.toHex(2) + ') = ' + address.toHex(4);
    } break;

    case INX: {
      var op      = this.peek(1), x = this.context.x, index = ( op + x ) & 0xff;
      var l       = this.context.memory.readRam( index ), h = this.context.memory.readRam( (index + 1) & 0xff );
      var address = ( (h << 8) | l ) & 0xffff;
      r += '($' + op.toHex(2) + ',X) @ ' + index.toHex(2) + ' = ' + address.toHex(4) + ' = ' + this.context.memory.readRam(address).toHex(2);
    } break;

    case INY: case IYN: {
      var op      = this.peek(1), y = this.context.y;
      var l       = this.context.memory.readRam( op ), h  = this.context.memory.readRam( (op + 1) & 0xff );
      var address = ( (h << 8) | l ) & 0xffff, index = ( address + y ) & 0xffff;
      r += '($' + op.toHex(2) + '),Y = ' + address.toHex(4) + ' @ ' + index.toHex(4) + ' = ' + this.context.memory.readRam( index ).toHex(2);
    } break;

    case REL: {
      var op1 = this.peek(1), pc = ( this.context.pc + 1 ) & 0xffff;
      r += '$' + ((pc + op1) & 0xffff).toHex(4);
    } break;

    case ZEP: {
      var op1 = this.peek(1);
      r += '$' + op1.toHex(2) + ' = ' + this.context.memory.readRam( op1 ).toHex(2);
    } break;

    case ZPX: {
      var op = this.peek(1), index = ( op + this.context.x ) & 0xff;
      r += '$' + op.toHex(2) + ',X @ ' + index.toHex(2) + ' = ' + this.context.memory.readRam( index ).toHex(2);
    } break;

    case ZPY: {
      var op = this.peek(1), index = ( op + this.context.y ) & 0xff;
      r += '$' + op.toHex(2) + ',Y @ ' + index.toHex(2) + ' = ' + this.context.memory.readRam( index ).toHex(2);
    } break;

    default: {
      configuration.running = false;
      throw 'explanation not definded < ' + ((this.context.pc - 1) & 0xffff).toHex(4) + ':' + opcode.toHex(2) + ' @' + mode + ' >';
    } break;
  }

  return r;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.Debugger.prototype.status = function() {
  var r = [];

  r.push('A:' + this.context.a.toHex(2) );
  r.push('X:' + this.context.x.toHex(2) );
  r.push('Y:' + this.context.y.toHex(2) );
  r.push('P:' + this.context.status.toHex(2) );
  r.push('SP:' + this.context.sp.toHex(2) );

  return r.join(' ');
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.Debugger.prototype.peek = function( offset ) {
  return this.context.memory.readRam( (this.context.pc + offset - 1) & 0xffff );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.Debugger.prototype.output = function( str ) {
  var p = document.createElement('pre');
  p.innerHTML = str;
  this.target.appendChild( p );
};

////////////////////////////////////////////////////////////////////////////////////////////////////
