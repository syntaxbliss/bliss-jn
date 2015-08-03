////////////////////////////////////////////////////////////////////////////////////////////////////

Object.prototype.toHex = function( size ) {
    var str = this.toString( 16 );
    while( str.length < size ) str = '0' + str;
    return str.toUpperCase();
}

Object.prototype.toLength = function( size, char ) {
    var str = this.toString();
    var c = char || ' ';
    while( str.length < size ) str = char + str;
    return str;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

var DEBUG_MODE = false;

////////////////////////////////////////////////////////////////////////////////////////////////////

var MIRRORING_VERTICAL   = 0;
var MIRRORING_HORIZONTAL = 1;

var PALETTE = [
    0x757575, 0x271b8f, 0x0000ab, 0x47009f, 0x8f0077, 0xab0013, 0xa70000, 0x7f0b00,
    0x432f00, 0x004700, 0x005100, 0x003f17, 0x1b3f5f, 0x000000, 0x000000, 0x000000,
    0xbcbcbc, 0x0073ef, 0x233bef, 0x8300f3, 0xbf00bf, 0xe7005b, 0xdb2b00, 0xcb4f0f,
    0x8b7300, 0x009700, 0x00ab00, 0x00933b, 0x00838b, 0x000000, 0x000000, 0x000000,
    0xffffff, 0x3fbfff, 0x5f97ff, 0xa78bfd, 0xf77bff, 0xff77b7, 0xff7763, 0xff9b3b,
    0xf3bf3f, 0x83d313, 0x4fdf4b, 0x58f898, 0x00ebdb, 0x000000, 0x000000, 0x000000,
    0xffffff, 0xabe7ff, 0xc7d7ff, 0xd7cbff, 0xffc7ff, 0xffc7db, 0xffbfb3, 0xffdbab,
    0xffe7a3, 0xe3ffa3, 0xabf3bf, 0xb3ffcf, 0x9ffff3, 0x000000, 0x000000, 0x000000
];

var ATTRIBUTE_LOCK = [
     0,  0,  0,  0,  1,  1,  1,  1,  2,  2,  2,  2,  3,  3,  3,  3,  4,  4,  4,  4,  5,  5,  5,  5,  6,  6,  6,  6,  7,  7,  7,  7,
     0,  0,  0,  0,  1,  1,  1,  1,  2,  2,  2,  2,  3,  3,  3,  3,  4,  4,  4,  4,  5,  5,  5,  5,  6,  6,  6,  6,  7,  7,  7,  7,
     0,  0,  0,  0,  1,  1,  1,  1,  2,  2,  2,  2,  3,  3,  3,  3,  4,  4,  4,  4,  5,  5,  5,  5,  6,  6,  6,  6,  7,  7,  7,  7,
     0,  0,  0,  0,  1,  1,  1,  1,  2,  2,  2,  2,  3,  3,  3,  3,  4,  4,  4,  4,  5,  5,  5,  5,  6,  6,  6,  6,  7,  7,  7,  7,
     8,  8,  8,  8,  9,  9,  9,  9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15,
     8,  8,  8,  8,  9,  9,  9,  9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15,
     8,  8,  8,  8,  9,  9,  9,  9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15,
     8,  8,  8,  8,  9,  9,  9,  9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15,
    16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 23, 23, 23, 23,
    16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 23, 23, 23, 23,
    16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 23, 23, 23, 23,
    16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 23, 23, 23, 23,
    24, 24, 24, 24, 25, 25, 25, 25, 26, 26, 26, 26, 27, 27, 27, 27, 28, 28, 28, 28, 29, 29, 29, 29, 30, 30, 30, 30, 31, 31, 31, 31,
    24, 24, 24, 24, 25, 25, 25, 25, 26, 26, 26, 26, 27, 27, 27, 27, 28, 28, 28, 28, 29, 29, 29, 29, 30, 30, 30, 30, 31, 31, 31, 31,
    24, 24, 24, 24, 25, 25, 25, 25, 26, 26, 26, 26, 27, 27, 27, 27, 28, 28, 28, 28, 29, 29, 29, 29, 30, 30, 30, 30, 31, 31, 31, 31,
    24, 24, 24, 24, 25, 25, 25, 25, 26, 26, 26, 26, 27, 27, 27, 27, 28, 28, 28, 28, 29, 29, 29, 29, 30, 30, 30, 30, 31, 31, 31, 31,
    32, 32, 32, 32, 33, 33, 33, 33, 34, 34, 34, 34, 35, 35, 35, 35, 36, 36, 36, 36, 37, 37, 37, 37, 38, 38, 38, 38, 39, 39, 39, 39,
    32, 32, 32, 32, 33, 33, 33, 33, 34, 34, 34, 34, 35, 35, 35, 35, 36, 36, 36, 36, 37, 37, 37, 37, 38, 38, 38, 38, 39, 39, 39, 39,
    32, 32, 32, 32, 33, 33, 33, 33, 34, 34, 34, 34, 35, 35, 35, 35, 36, 36, 36, 36, 37, 37, 37, 37, 38, 38, 38, 38, 39, 39, 39, 39,
    32, 32, 32, 32, 33, 33, 33, 33, 34, 34, 34, 34, 35, 35, 35, 35, 36, 36, 36, 36, 37, 37, 37, 37, 38, 38, 38, 38, 39, 39, 39, 39,
    40, 40, 40, 40, 41, 41, 41, 41, 42, 42, 42, 42, 43, 43, 43, 43, 44, 44, 44, 44, 45, 45, 45, 45, 46, 46, 46, 46, 47, 47, 47, 47,
    40, 40, 40, 40, 41, 41, 41, 41, 42, 42, 42, 42, 43, 43, 43, 43, 44, 44, 44, 44, 45, 45, 45, 45, 46, 46, 46, 46, 47, 47, 47, 47,
    40, 40, 40, 40, 41, 41, 41, 41, 42, 42, 42, 42, 43, 43, 43, 43, 44, 44, 44, 44, 45, 45, 45, 45, 46, 46, 46, 46, 47, 47, 47, 47,
    40, 40, 40, 40, 41, 41, 41, 41, 42, 42, 42, 42, 43, 43, 43, 43, 44, 44, 44, 44, 45, 45, 45, 45, 46, 46, 46, 46, 47, 47, 47, 47,
    48, 48, 48, 48, 49, 49, 49, 49, 50, 50, 50, 50, 51, 51, 51, 51, 52, 52, 52, 52, 53, 53, 53, 53, 54, 54, 54, 54, 55, 55, 55, 55,
    48, 48, 48, 48, 49, 49, 49, 49, 50, 50, 50, 50, 51, 51, 51, 51, 52, 52, 52, 52, 53, 53, 53, 53, 54, 54, 54, 54, 55, 55, 55, 55,
    48, 48, 48, 48, 49, 49, 49, 49, 50, 50, 50, 50, 51, 51, 51, 51, 52, 52, 52, 52, 53, 53, 53, 53, 54, 54, 54, 54, 55, 55, 55, 55,
    48, 48, 48, 48, 49, 49, 49, 49, 50, 50, 50, 50, 51, 51, 51, 51, 52, 52, 52, 52, 53, 53, 53, 53, 54, 54, 54, 54, 55, 55, 55, 55,
    56, 56, 56, 56, 57, 57, 57, 57, 58, 58, 58, 58, 59, 59, 59, 59, 60, 60, 60, 60, 61, 61, 61, 61, 62, 62, 62, 62, 63, 63, 63, 63,
    56, 56, 56, 56, 57, 57, 57, 57, 58, 58, 58, 58, 59, 59, 59, 59, 60, 60, 60, 60, 61, 61, 61, 61, 62, 62, 62, 62, 63, 63, 63, 63,
    56, 56, 56, 56, 57, 57, 57, 57, 58, 58, 58, 58, 59, 59, 59, 59, 60, 60, 60, 60, 61, 61, 61, 61, 62, 62, 62, 62, 63, 63, 63, 63,
    56, 56, 56, 56, 57, 57, 57, 57, 58, 58, 58, 58, 59, 59, 59, 59, 60, 60, 60, 60, 61, 61, 61, 61, 62, 62, 62, 62, 63, 63, 63, 63
];

var ATTRIBUTE_MASK = [
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
    0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0, 0x30, 0x30, 0xc0, 0xc0,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,
     0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc,  0x3,  0x3,  0xc,  0xc
];

var ATTRIBUTE_SHIFT = [
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6, 4, 4, 6, 6,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2,
    0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2
];

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
    this.nes    = new BlissJN.NES( args.gameData, args.target, args.patternsViewer );
    this.initialize();
}

BlissJN.prototype = {
    initialize : function() {
        var self = this;
        window.addEventListener('keypress', function(ev) {
            switch( ev.keyCode ) {
                case 27: { // escape
                    self.nes.handleKey( ev.keyCode );
                } break;
            }
        }, false );
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.NES = function( data, target, patternsViewer ) {
    this.mmu            = new BlissJN.NES.MMU( data );
    this.m6502          = new BlissJN.NES.M6502( this.mmu, target );
    this.target         = target;
    this.patternsViewer = patternsViewer;
    this.totalTicks     = 0;
    this.frameTicks     = 0;
    this.start();
}

BlissJN.NES.prototype = {
    start : function() {
        var self = this;

        console.log( 'Emulation started' );

        this.m6502.reset();
        this.fps = setInterval( function() {
            self.runFrame();
            self.renderFrame();
            self.debugPatternTables();
        }, 1000 / 60 );
    },

    handleKey : function( code ) {
        switch( code ) {
            case 27: { // escape
                console.log( 'Emulation finished' );
                clearInterval( this.fps );
            } break;
        }
    },

    runFrame : function() {
        var timming = [ 114, 114, 113 ], index = 0, ticks = 0;

        for( var i = 0; i < 262; i++ ) {
            while( ticks < timming[index % 3] ) {
                var t = this.m6502.execute( this.m6502.fetch() );
                ticks += t;
            }
            ticks -= timming[ index % 3 ];
            index++;

            this.mmu.clockPPU();
            this.clockInterrupts();
        }
    },

    clockInterrupts : function() {
        if( this.mmu.wantNMI() ) this.m6502.triggerNMI();
    },

    debugPatternTables : function() {
        var vram   = this.mmu.getVRAM();
        var buffer = [], palette = [ 0x000000, 0xff0000, 0x00ff00, 0x0000ff ];
        for( var tile = 0; tile < 0x2000; tile += 16 ) {
            for( var line = 0; line < 8; line++ ) {
                var l = vram[ tile + line ], h = vram[ tile + line + 8 ];
                for( var bit = 7; bit >= 0; bit-- ) {
                    var c0 = ( l >> bit ) & 0x1;
                    var c1 = ( h >> bit ) & 0x1;
                    var colour = ( (c1 << 1) | c0 ) & 0x3;
                    buffer.push( palette[colour] );
                }
            }
        }

        var canvas = this.patternsViewer, ctx = this.patternsViewer.getContext('2d'), imgData = ctx.createImageData( canvas.width, canvas.height );
        var x = 0, y = 0, tile = 0;
        for( var i = 0; i < buffer.length; i++ ) {
            var colour = buffer[ i ];
            var index = 4 * ( x + y * canvas.width );
            imgData.data[ index ] = ( colour >> 16 ) & 0xff;
            imgData.data[ index + 1 ] = ( colour >> 8 ) & 0xff;
            imgData.data[ index + 2 ] = colour & 0xff;
            imgData.data[ index + 3 ] = 255;

            x++;
            if( x % 8 === 0 ) {
                y++;
                if( y % 8 === 0 ) {
                    tile++;
                    y = Math.floor( tile / 32 ) * 8;
                }
                x = ( tile % 32 ) * 8;
            }
        }
        ctx.putImageData( imgData, 0, 0 );
    },

    renderFrame : function() {
        var frame = this.mmu.getScreenBuffer(), buffer = [];
        frame.forEach( function(i) { buffer.push(PALETTE[i]) });
        var canvas = this.target, ctx = this.target.getContext('2d'), imgData = ctx.createImageData( canvas.width, canvas.height ), index = 0;
        for( var i = 0; i < buffer.length; i++ ) {
            var colour = buffer[ i ];
            imgData.data[ index++ ] = ( colour >> 16 ) & 0xff;
            imgData.data[ index++ ] = ( colour >> 8 ) & 0xff;
            imgData.data[ index++ ] = colour & 0xff;
            imgData.data[ index++ ] = 255;
        }
        ctx.putImageData( imgData, 0, 0 );
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
    this.ppu = new BlissJN.NES.PPU( this );
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
        this.ppu.setMirroring( data[6] );
    },

    clockPPU : function() {
        this.ppu.runScanline();
    },

    getScreenBuffer : function() {
        return this.ppu.getScreenBuffer();
    },

    wantNMI : function() {
        return this.ppu.wantNMI();
    },

    readByte : function( address ) {
        // ram
        if( address < 0x2000 ) return this.rom[ address & 0x07ff ];

        // ppu registers
        else if( address < 0x4000 ) return this.ppu.readRegister( address & 0x7 );

        // fallback
        else return this.rom[ address ];
    },

    writeByte : function( address, value ) {
        // ram
        if( address < 0x2000 ) this.rom[ address & 0x07ff ] = value;

        // ppu registers
        else if( address < 0x4000 ) this.ppu.writeRegister( address & 0x7, value );

        // fallback
        else this.rom[ address ] = value;
    },

    readVRAM : function( address ) {
        return this.vram[ address ];
    },

    writeVRAM : function( address, value ) {
        this.vram[ address ] = value;
    },

    getVRAM : function() {
        return this.vram;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.NES.PPU = function( mmu ) {
    this.mmu          = mmu;
    this.regs         = { 0 : 0, 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0 };
    this.loopyT       = 0;
    this.first        = true;
    this.mirroring    = MIRRORING_HORIZONTAL;
    this.bus          = 0;
    this.buffer       = 0;
    this.scanline     = 0;
    this.pendingNMI   = false;
    this.screenBuffer = [];
}

BlissJN.NES.PPU.prototype = {
    setMirroring : function( value ) {
        this.mirroring = value;
    },

    getScreenBuffer : function() {
        return this.screenBuffer;
    },

    wantNMI : function() {
        var r = this.pendingNMI;
        if( r ) this.pendingNMI = false;
        return r;
    },

    isVBlank : function() {
        return ( (this.regs[2] & 0x80) === 0x80 );
    },

    backgroundEnabled : function() {
        return ( (this.regs[1] & 0x8) === 0x8 );
    },

    isRendering : function() {
        return ( (! this.isVBlank()) && this.backgroundEnabled() );
    },

    readRegister : function( register ) {
        switch( register ) {
            case 2: {
                var r = this.regs[2];
                if( this.isVBlank() ) r |= 0x80;
                this.regs[2] &= 0x7f;
                this.first = true;
                return r;
            } break;

            case 4: {
                // TODO: sprites
            } break;

            case 7: {
                var r = 0;

                // 'ppuaddr' esta dentro del rango de la paleta
                if( (this.regs[6] >= 0x3f00) && (this.regs[6] < 0x4000) ) {
                    r = this.mmu.readVRAM( this.regs[6] );
                    this.buffer = this.mmu.readVRAM( (this.regs[6] - 0x1000) & 0xffff );
                }
                
                // 'ppuaddr' esta fuera del rango de la paleta
                else {
                    r = this.buffer;
                    this.buffer = this.mmu.readVRAM( this.regs[6] );
                }
                
                // incrementar el valor de 'ppuaddr' segun 'ppuctrl:2'
                this.regs[6] += ( (this.regs[0] & 0x4) === 0x4 ? 32 : 1 );
                
                return r;
            } break;

            case 0: case 1: case 5: case 6: return this.bus;
        }
    },

    writeRegister : function( register, value ) {
        switch( register ) {
            case 0: {
                this.regs[0] = value;
                this.loopyT &= 0x73ff;
                this.loopyT |= ( (value & 0x3 ) << 10 ) & 0xffff;
            } break;

            case 1: {
                this.regs[1] = value;
            } break;

            case 3: case 4: {
                // TODO: sprites
            } break;

            case 5: {
                if( this.first ) {
                    this.loopyT &= 0x7fe0;
                    this.loopyT |= ( (value & 0xf8) >> 3 ) & 0xffff;
                } else {
                    this.loopyT &= 0x0c1f;
                    this.loopyT |= ( ((value & 0xf8) << 2) | ((value & 0x7) << 12) ) & 0xffff;
                }
                this.first ^= true;
            } break;

            case 6: {
                if( this.first ) {
                    this.loopyT &= 0x40ff;
                    this.loopyT |= ( (value & 0x3f) << 8 ) & 0xffff;
                } else {
                    this.loopyT &= 0x7f00;
                    this.loopyT |= value;
                    this.regs[6] = this.loopyT;
                }
                this.first ^= true;
            } break;

            case 7: {
                // name tables
                if( this.regs[6] < 0x3000 ) {
                    // TODO: mappers
                    if( this.regs[6] >= 0x2000 ) {
                        var t = this.regs[6] & 0x2c00;

                        if( this.mirroring === MIRRORING_VERTICAL ) {
                            if( t === 0x2000 ) {
                                this.mmu.writeVRAM( this.regs[6], value );
                                this.mmu.writeVRAM( (this.regs[6] + 0x800) & 0xffff, value );
                            } else if( t === 0x2400 ) {
                                this.mmu.writeVRAM( this.regs[6], value );
                                this.mmu.writeVRAM( (this.regs[6] + 0x800) & 0xffff, value );
                            } else if( t === 0x2800 ) {
                                this.mmu.writeVRAM( this.regs[6], value );
                                this.mmu.writeVRAM( (this.regs[6] - 0x800) & 0xffff, value );
                            } else if( t === 0x2c00 ) {
                                this.mmu.writeVRAM( this.regs[6], value );
                                this.mmu.writeVRAM( (this.regs[6] - 0x800) & 0xffff, value );
                            }
                        } else if( this.mirroring === MIRRORING_HORIZONTAL ) {
                            if( t === 0x2000 ) {
                                this.mmu.writeVRAM( this.regs[6], value );
                                this.mmu.writeVRAM( (this.regs[6] + 0x400) & 0xffff, value );
                            } else if( t === 0x2400 ) {
                                this.mmu.writeVRAM( this.regs[6], value );
                                this.mmu.writeVRAM( (this.regs[6] - 0x400) & 0xffff, value );
                            } else if( t === 0x2800 ) {
                                this.mmu.writeVRAM( this.regs[6], value );
                                this.mmu.writeVRAM( (this.regs[6] + 0x400) & 0xffff, value );
                            } else if( t === 0x2c00 ) {
                                this.mmu.writeVRAM( this.regs[6], value );
                                this.mmu.writeVRAM( (this.regs[6] - 0x400) & 0xffff, value );
                            }
                        }
                    }
                }

                // paleta
                else if( this.regs[6] < 0x4000 ) {
                    value &= 0x3f;
                    this.mmu.writeVRAM( this.regs[6], value );
                    if( (this.regs[6] === 0x3f00) || (this.regs[6] === 0x3f10) ) {
                        this.mmu.writeVRAM( 0x3f00, value );
                        this.mmu.writeVRAM( 0x3f10, value );
                    } else if( (this.regs[6] === 0x3f04) || (this.regs[6] === 0x3f14) ) {
                        this.mmu.writeVRAM( 0x3f04, value );
                        this.mmu.writeVRAM( 0x3f14, value );
                    } else if( (this.regs[6] === 0x3f08) || (this.regs[6] === 0x3f18) ) {
                        this.mmu.writeVRAM( 0x3f08, value );
                        this.mmu.writeVRAM( 0x3f18, value );
                    } else if( (this.regs[6] === 0x3f0c) || (this.regs[6] === 0x3f1c) ) {
                        this.mmu.writeVRAM( 0x3f0c, value );
                        this.mmu.writeVRAM( 0x3f1c, value );
                    }
                }

                this.regs[6] += ( (this.regs[0] & 0x4) === 0x4 ? 32 : 1 );
            } break;
        }
    },

    runScanline : function() {
        // pre-render scanline
        if( this.scanline === 0 ) {
            this.screenBuffer = [];
            if( this.isRendering() ) this.regs[6] = this.loopyT;
        }

        // visible scanlines
        else if( this.scanline <= 240  ) {
            if( this.backgroundEnabled() ) {
                this.regs[6] &= 0xfbe0;
                this.regs[6] |= ( this.loopyT & 0x041f );
                this.drawBackground();
                if( (this.regs[6] & 0x7000) === 0x7000 ) {
                    var t = ( this.regs[6] & 0x03e0 );
                    this.regs[6] &= 0xfff;
                    switch( t ) {
                        case 0x03a0: this.regs[6] ^= 0x0ba0; break;
                        case 0x03e0: this.regs[6] ^= 0x03e0; break;
                        default: this.regs[6] += 0x0020; break;
                    }
                } else {
                    this.regs[6] += 0x1000;
                }
            }
        }

        // post-render scanline
        else if( this.scanline === 241 ) {
            this.regs[2] |= 0x80;
            if( (this.regs[0] & 0x80) === 0x80 ) this.pendingNMI = true;
        }
        
        // ultimo scanline del vblank
        else if( this.scanline === 261 ) {
            this.regs[2] &= 0x7f;
            this.scanline = -1;
        }

        this.scanline++;
    },

    drawBackground : function() {
        var nameTableAddress      = ( (this.regs[0] & 0x3) * 0x400 + 0x2000 ) & 0xffff;
        var attributeTableAddress = ( nameTableAddress + 0x03c0 ) & 0xffff;
        var patternTableAddress   = ( (this.regs[0] & 0x10) === 0x10 ? 0x1000 : 0 );
        
        for( var tile = 0; tile < 32; tile++ ) {
            var tileNumber     = this.mmu.readVRAM( (nameTableAddress | (this.regs[6] & 0xfff)) & 0xffff );
            var patternAddress = ( (tileNumber << 4) | (this.regs[6] >> 12) |  patternTableAddress ) & 0xffff;
            var attributeByte  =  this.mmu.readVRAM( (attributeTableAddress | (this.regs[6] & 0xc00) | ATTRIBUTE_LOCK[this.regs[6] & 0x3ff]) & 0xffff );
            attributeByte &= ATTRIBUTE_MASK[ this.regs[6] & 0x3ff ];
            attributeByte >>= ATTRIBUTE_SHIFT[ this.regs[6] & 0x3ff ];
            for( var bit = 7; bit >= 0; bit-- ) {
                var c0 = ( this.mmu.readVRAM(patternAddress) >> bit ) & 0x1;
                var c1 = ( this.mmu.readVRAM(patternAddress | 8) >> bit ) & 0x1;
                var index = ( (attributeByte << 2) | (c1 << 1) | c0 ) & 0xf;
                this.screenBuffer.push( this.mmu.readVRAM((0x3f00 | index) & 0xffff) );
            }

            if( (this.regs[6] & 0x1f) === 0x1f ) this.regs[6] ^= 0x41f; else this.regs[6]++;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////

BlissJN.NES.M6502 = function( mmu, target ) {
    this.debugger = new BlissJN.NES.M6502.Debugger( target );
    this.mmu      = mmu;
    this.pc       = 0x00;
    this.a        = 0x00;
    this.x        = 0x00;
    this.y        = 0x00;
    this.sp       = 0xfd;
    this.status   = 0x24;
    this.ticks    = 0;
}

BlissJN.NES.M6502.prototype = {
    reset : function() {
        if( DEBUG_MODE ) {
            this.pc = 0xc000
        } else {
            var l = this.mmu.readByte( 0xfffc ), h = this.mmu.readByte( 0xfffd );
            this.pc = ( (h << 8) | l ) & 0xffff;
        }
    },

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

    triggerNMI : function() {
        this.stackPush( (this.pc >> 8) & 0xff );
        this.stackPush( this.pc & 0xff );
        this.stackPush( (this.status | 0x20) & 0xff );
        this.status |= FLAG_I;
        var l = this.mmu.readByte( 0xfffa ), h = this.mmu.readByte( 0xfffb );
        this.pc = ( (h << 8) | l ) & 0xffff;
    },

    fetch : function() {
        var address = this.pc;
        this.pc = ( this.pc + 1 ) & 0xffff;
        return this.mmu.readByte( address );
    },

    execute : function( opcode ) {
        if( DEBUG_MODE ) this.debugger.trace( this.getContext(), opcode );
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

            case ABX: {
                var l = this.fetch(), h = this.fetch();
                address = ( ((h << 8) | l) + this.x ) & 0xffff;
                if( l + this.x > 0xff ) this.ticks++;
            } break;

            case ABY: {
                var l = this.fetch(), h = this.fetch();
                address = ( ((h << 8) | l) + this.y ) & 0xffff;
                if( l + this.y > 0xff ) this.ticks++;
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

            case INY: {
                var r = this.fetch();
                var l = this.mmu.readByte( r ), h = this.mmu.readByte( (r + 1) & 0xff );
                address = ( ((h << 8) | l) + this.y ) & 0xffff;
                if( l + this.y > 0xff ) this.ticks++;
            } break;

            case IYN: {
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
            this.ticks++;
            var before = ( this.pc >> 8 ) & 0xff;
            this.pc = ( this.pc + offset ) & 0xffff;
            if( before !== ((this.pc >> 8) & 0xff) ) this.ticks++;
        }
    },

    BCS : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_C) === FLAG_C ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.ticks++;
            var before = ( this.pc >> 8 ) & 0xff;
            this.pc = ( this.pc + offset ) & 0xffff;
            if( before !== ((this.pc >> 8) & 0xff) ) this.ticks++;
        }
    },

    BEQ : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_Z) === FLAG_Z ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.ticks++;
            var before = ( this.pc >> 8 ) & 0xff;
            this.pc = ( this.pc + offset ) & 0xffff;
            if( before !== ((this.pc >> 8) & 0xff) ) this.ticks++;
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
            this.ticks++;
            var before = ( this.pc >> 8 ) & 0xff;
            this.pc = ( this.pc + offset ) & 0xffff;
            if( before !== ((this.pc >> 8) & 0xff) ) this.ticks++;
        }
    },

    BPL : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_N) !== FLAG_N ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.ticks++;
            var before = ( this.pc >> 8 ) & 0xff;
            this.pc = ( this.pc + offset ) & 0xffff;
            if( before !== ((this.pc >> 8) & 0xff) ) this.ticks++;
        }
    },

    BMI : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_N) === FLAG_N ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.ticks++;
            var before = ( this.pc >> 8 ) & 0xff;
            this.pc = ( this.pc + offset ) & 0xffff;
            if( before !== ((this.pc >> 8) & 0xff) ) this.ticks++;
        }
    },

    BVC : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_V) !== FLAG_V ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.ticks++;
            var before = ( this.pc >> 8 ) & 0xff;
            this.pc = ( this.pc + offset ) & 0xffff;
            if( before !== ((this.pc >> 8) & 0xff) ) this.ticks++;
        }
    },

    BVS : function( mode ) {
        var offset = this.getAddress( mode );
        if( (this.status & FLAG_V) === FLAG_V ) {
            if( (offset & 0x80) === 0x80 ) offset = ( offset - 0x100 );
            this.ticks++;
            var before = ( this.pc >> 8 ) & 0xff;
            this.pc = ( this.pc + offset ) & 0xffff;
            if( before !== ((this.pc >> 8) & 0xff) ) this.ticks++;
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
    this.target     = target;
    this.context    = null;
    this.m6502Ticks = 0;
    this.debugTicks = 0;
};

BlissJN.NES.M6502.Debugger.prototype = {
    trace : function( context, opcode ) {
        this.context = context;
        this.m6502Ticks = this.context.ticks;
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

            case ABX: case AXN: {
                var l = this.peek(1), h = this.peek(2), address = ( (h << 8) | l ) & 0xffff, disp = ( address + this.context.x ) & 0xffff;
                str += '$' + address.toHex(4) + ',X @ ' + disp.toHex(4) + ' = ' + this.context.mmu.readByte( disp ).toHex(2) + '         ';
            } break;

            case ABY: case AYN: {
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

            case INY: case IYN: {
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
        this.debugTicks += this.m6502Ticks * 3;
        if( this.debugTicks >= 341 ) this.debugTicks -= 341;
        var a = [];
        a.push('A:' + this.context.a.toHex(2) );
        a.push('X:' + this.context.x.toHex(2) );
        a.push('Y:' + this.context.y.toHex(2) );
        a.push('P:' + this.context.status.toHex(2) );
        a.push('SP:' + this.context.sp.toHex(2) );
        a.push('CYC:' + this.debugTicks.toLength(3) );
        return a.join(' ');
    },

    renderString : function( string ) {
        var e = document.createElement('pre');
        e.innerHTML = string;
        this.target.appendChild( e );
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
