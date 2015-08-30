////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.Debugger = function( args ) {
  this.context    = null;
  this.timeBase   = 3;
  this.totalTicks = 0;
  this.memory     = args.memory;
  this.palette    = [ 0x000000, 0xff0000, 0x00ff00, 0x0000ff ];

  this.stackTrace = $( args.stackTrace );

  this.patternTables = {
    target: $( args.patternTables ),
    context: $( args.patternTables ).getContext('2d')
  };
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.Debugger.prototype.trace = function( context, opcode ) {
  this.context = context;
  var str = ( (context.pc - 1) & 0xffff ).toHex(4).toLength(6)
    + opcode.toHex(2).toLength(3)
    + this.operands( opcode ).toLength(7)
    + this.explain( opcode ).toLength(32)
    + this.status().toLength(26)
    + this.ticks( opcode ).toLength(7);

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
      if( ['JMP', 'JSR'].indexOf(name) === -1 ) r += ' = ' + this.memory.readRam( ((op2 << 8) | op1) & 0xffff ).toHex(2);
    } break;

    case ABX: case AXN: {
      var op1   = this.peek(1), op2 = this.peek(2);
      var index = ( ((op2 << 8) | op1) + this.context.x ) & 0xffff;
      r += '$' + op2.toHex(2) + op1.toHex(2) + ',X @ ' + index.toHex(4) + ' = ' + this.memory.readRam( index ).toHex(2);
    } break;

    case ABY: case AYN: {
      var op1   = this.peek(1), op2 = this.peek(2);
      var index = ( ((op2 << 8) | op1) + this.context.y ) & 0xffff;
      r += '$' + op2.toHex(2) + op1.toHex(2) + ',Y @ ' + index.toHex(4) + ' = ' + this.memory.readRam( index ).toHex(2);
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
      var l       = this.memory.readRam( ((op2 << 8) | op1) & 0xffff ), h = this.memory.readRam( (((op2 << 8) | op1) + 1) & 0xffff );
      var address = ( (h << 8) | l ) & 0xffff;
      r += '($' + op2.toHex(2) + op1.toHex(2) + ') = ' + address.toHex(4);
    } break;

    case INX: {
      var op      = this.peek(1), x = this.context.x, index = ( op + x ) & 0xff;
      var l       = this.memory.readRam( index ), h = this.memory.readRam( (index + 1) & 0xff );
      var address = ( (h << 8) | l ) & 0xffff;
      r += '($' + op.toHex(2) + ',X) @ ' + index.toHex(2) + ' = ' + address.toHex(4) + ' = ' + this.memory.readRam(address).toHex(2);
    } break;

    case INY: case IYN: {
      var op      = this.peek(1), y = this.context.y;
      var l       = this.memory.readRam( op ), h  = this.memory.readRam( (op + 1) & 0xff );
      var address = ( (h << 8) | l ) & 0xffff, index = ( address + y ) & 0xffff;
      r += '($' + op.toHex(2) + '),Y = ' + address.toHex(4) + ' @ ' + index.toHex(4) + ' = ' + this.memory.readRam( index ).toHex(2);
    } break;

    case REL: {
      var op1 = this.peek(1), pc = ( this.context.pc + 1 ) & 0xffff;
      r += '$' + ((pc + op1) & 0xffff).toHex(4);
    } break;

    case ZEP: {
      var op1 = this.peek(1);
      r += '$' + op1.toHex(2) + ' = ' + this.memory.readRam( op1 ).toHex(2);
    } break;

    case ZPX: {
      var op = this.peek(1), index = ( op + this.context.x ) & 0xff;
      r += '$' + op.toHex(2) + ',X @ ' + index.toHex(2) + ' = ' + this.memory.readRam( index ).toHex(2);
    } break;

    case ZPY: {
      var op = this.peek(1), index = ( op + this.context.y ) & 0xff;
      r += '$' + op.toHex(2) + ',Y @ ' + index.toHex(2) + ' = ' + this.memory.readRam( index ).toHex(2);
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
  return this.memory.readRam( (this.context.pc + offset - 1) & 0xffff );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.Debugger.prototype.output = function( str ) {
  var p = document.createElement('pre');
  p.innerHTML = str;
  this.stackTrace.appendChild( p );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.Debugger.prototype.ticks = function( opcode ) {
  var r = 'CYC:'

  this.totalTicks += this.context.ticks * this.timeBase;
  if( this.totalTicks >= 341 ) this.totalTicks -= 341;

  var count = this.totalTicks.toString();
  while( count.length < 3 ) count = ' ' + count;
  r += count;


  return r;
};

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.Debugger.prototype.showPatternTables = function() {
  var buffer = [];
  for( var tile = 0; tile < 0x2000; tile += 16 ) {
    for( var line = 0; line < 8; line++ ) {
      var l = this.memory.readVram( (tile + line) & 0xffff ), h = this.memory.readVram( (tile + line + 8) & 0xffff );
      for( var pixel = 7; pixel >= 0; pixel-- ) {
        var c0 = ( l >> pixel ) & 0x1, c1 = ( h >> pixel ) & 0x1;
        buffer.push( this.palette[((c1 << 1) | c0) & 0x3] );
      }
    }
  }

  var w       = this.patternTables.target.width, h = this.patternTables.target.height;
  var imgData = this.patternTables.context.createImageData( w, h );
  var x       = 0, y = 0, tile = 0;
  buffer.forEach( function(i) {
    var index = 4 * ( y * w + x );
    imgData.data[ index++ ] = ( i >> 16 ) & 0xff;
    imgData.data[ index++ ] = ( i >> 8 ) & 0xff;
    imgData.data[ index++ ] = i & 0xff;
    imgData.data[ index++ ] = 255;
    x++;
    if( (x % 8) === 0 ) {
      y++;
      if( (y % 8) === 0 ) {
        tile++;
        y = Math.floor( tile / 32 ) * 8;
      }
      x = ( tile % 32 ) * 8;
    }
  });
  this.patternTables.context.putImageData( imgData, 0, 0 );
};

////////////////////////////////////////////////////////////////////////////////////////////////////
