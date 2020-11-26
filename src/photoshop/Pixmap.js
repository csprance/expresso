﻿// Original code:
/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/**
 * A raw image buffer received from Photoshop.
 */
export default class Pixmap {
  constructor(buffer) {
    this.format = buffer.readUInt8(0);
    this.width = buffer.readUInt32BE(1);
    this.height = buffer.readUInt32BE(5);
    this.rowBytes = buffer.readUInt32BE(9);
    this.colorMode = buffer.readUInt8(13);
    this.channelCount = buffer.readUInt8(14);
    this.bitsPerChannel = buffer.readUInt8(15);
    this.pixels = buffer.slice(
      16,
      16 + this.width * this.height * this.channelCount
    );
    this.bytesPerPixel = this.bitsPerChannel / (8 * this.channelCount);
    this.padding = this.rowBytes - this.width * this.channelCount;
  }
}
