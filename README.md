# HTML Formatter #

>Parses HTML into a DOM tree then re-writes the file according to (proper?
>specified? my preferred?) standards for tabs, new-lines, etc.
>
>v0.1.0
>
>Copyright 2017 Steven Barnett (stevendesu)

## Table of Contents ##

 - [Description](#description)
 - [Deprecated Features](#deprecated-features)
 - [Requirements](#requirements)
 - [Installation](#installation)
 - [Usage](#usage)
 - [Contributin'](#contributin)
 - [License](#license)


## Description ##

After searching the internet for an entire day, I realized that there were no
HTML beautifiers that properly supported [blade templates](https://laravel.com/docs/5.3/blade)

If you just want to clean up raw HTML, or if you want to clean up Handlebars
templates, there are better libraries currently that have much more development
time, more testing, and a larger community. I strongly recommend trying one of
these tools first:

 - [js-beautify](https://www.npmjs.com/package/js-beautify)
 - [html-tidy](https://www.npmjs.com/package/htmltidy2)
 - [tidy-html5](https://www.npmjs.com/package/tidy-html5)

The problem is that every one of these tools **also** cleans up text nodes, so
something like:

```html
@for($i = 0; $i < 5; $i++)
    @if($i % 2 == 0)
        <span>{{ $i }} is even</span>
    @endif
@endfor
```

becomes:

```html
@for($i = 0; $i < 5; $i++) @if($i % 2 == 0)
<span>{{ $i }} is even</span>
@endif @endfor
```

There are open issues on each of these repositories to add support for blade
templates, but since no work had been done yet to accomplish that I took the
initiate and created my own tool. The specs were simple:

 - Fix my indenting
 - Don't mess with text nodes

Note that this spec fixes more than just blade templates. In theory this tool
should support **any HTML templating system**


## Deprecated Features ##

Nothing has been deprecated yet


## Requirements ##

`html-formatter` depends on `htmlparser2` to build an abstract syntax tree for
the DOM. There are no other dependencies at this time, and this one dependency
is installed automatically if `html-formatter` is installed via NPM

(TODO: Put this package on npmjs so it can actually be installed via NPM)


## Installation ##

For the time being, the easiest way to install this tool is by either
downloading the source or cloning the repository. Afterwards, navigate to the
installation folder in the command line and type the following:

```
npm install
```

This will download `htmlparser2`


## Usage ##

For now, `html-formatter` can only be used as a command-line tool like so:

```
node /path/to/html-formatter/index.js /path/to/html-file.html
```

This will overwrite the original file with the formatted one.


## Contributin' ##

**Please** don't be afraid to open issues, make pull requests, or suggest
improvements. I have no intention of being a benevolent dictator of this code
and would love to see it grow into something more usable.

Unlike [my previous package](https://github.com/stevendesu/minimux) which was
focused on minimalism (and I therefore openly stated I didn't intend to include
much new functionality), this is a development tool and as such the more
features the better! No matter how asinine, I'll appreciate all new features:
 - colorizing output
 - gulp support
 - multi-file support
 - CSS / JS formatting
 - auto-commenting
 - whatever else you can dream up


## License ##

**MIT +no-false-attribs**

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

Distributions of all or part of the Software intended to be used by the
recipients as they would use the unmodified Software, containing modifications
that substantially alter, remove, or disable functionality of the Software,
outside of the documented configuration mechanisms provided by the Software,
shall be modified such that the Original Author's bug reporting email addresses
and urls are either replaced with the contact information of the parties
responsible for the changes, or removed entirely.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.