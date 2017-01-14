const fs = require('fs');
const htmlparser = require("htmlparser2");

const selfClosingHtmlTags = [
	'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source',
	'track', 'wbr'
];
const booleanAttributes = [
	'async', 'autocomplete', 'autofocus', 'autoplay', 'autosave', 'checked', 'contenteditable', 'controls', 'defer',
	'disabled', 'download', 'draggable', 'dropzone', 'hidden', 'ismap', 'loop', 'multiple', 'muted', 'novalidate',
	'open', 'preload', 'readonly', 'required', 'reversed', 'sandbox', 'seamless', 'selected', 'spellcheck', 'wrap'
];

// General TODO:
//  - Add options
//  - Add unit tests
//  - Get this guy on npmjs
//  - Ability to use as JS package and not just CLI tool

let file = fs.readFileSync(process.argv[2], 'utf8');
let output = "";

// Before doing any parsing:
// Laravel has a LOT of files which start with <?php but don't have an ending tag
// This is entirely valid, but breaks this parser
// Let's find such patterns and set them aside to keep them safe
let pos = 0;
let endingPHPTag = "";
while ((pos = file.indexOf('<?php', pos)) !== -1)
{
	if (file.indexOf('?>', pos) === -1)
	{
		// No ending tag
		endingPHPTag = file.substr(pos);
		file = file.substr(0, pos);
	}
}

let handler = new htmlparser.DomHandler(function(error, dom)
{
	if (error)
	{
		console.error(error);
	}
	else
	{
		buildOutput(dom);
	}
});
let parser = new htmlparser.Parser(handler);
parser.write(file);
parser.end();

function buildOutput(dom)
{
	(function DFS(node, indent)
	{
		if (!node)
		{
			// Empty file, I guess?
			return;
		}
		do
		{
			switch (node.type)
			{
				case 'directive':
					// Don't mess with directives
					// TODO: Possibly special handling for certain types of directives (like PHP beautification)
					output += '<' + node.data + '>';
					break;
				case 'text':
					// If pure whitespace, we can scrap it
					// Otherwise, leave it alone...
					// Although remove trailing new-line
					if (/\S/.test(node.data))
					{
						// TODO: Replace \n\t+ with appropriate amount of tabs, but ignore anything within <pre>
						output += node.data.replace(/\t+$/, "").replace(/\n$/, "");
					}
					break;
				case 'comment':
					if (node.prev.type == 'text' && node.prev.data.indexOf("\n") !== -1)
					{
						// TODO: Verify that this handles weird comments like <!--[if !(IE 8) ]><!-->
						// Also TODO: Verify that this handles empty comments <!> and multi-comments <!-------->
						output += "\n" + "\t".repeat(indent);
					}
					output += '<!--' + node.data + "-->";
					break;
				case 'tag':
					if (node.children.length == 1 && node.children[0].type == 'text')
					{
						if (/\S/.test(node.children[0].data))
						{
							// <tag>text</tag>
							output += "\n" + "\t".repeat(indent) + printTag(node);
							output += node.children[0].data;
							output += printTag(node, true);
						} else {
							// <tag>\n\t\t\t\t</tag> == <tag />
							output += "\n" + "\t".repeat(indent) + printTag(node, false, true); // Self-closing
						}
					}
					else if(node.children.length)
					{
						// <tag>
						// TODO: Don't indent <html> (possibly pass list of non-indented tags as option?)
						output += "\n" + "\t".repeat(indent) + printTag(node);
						DFS(node.children[0], indent + 1); // Recurse
						output += "\n" + "\t".repeat(indent) + printTag(node, true); // End tag
					}
					else
					{
						// <tag />
						output += "\n" + "\t".repeat(indent) + printTag(node, false, true); // Self-closing
					}
					break;
				case 'script':
					// TODO: (maybe) run js-beautifier on the contents of scripts with type="text/javascript"
					output += "\n" + "\t".repeat(indent) + printTag(node);
					if (node.children.length)
					{
						output += node.children[0].data;
					}
					output += printTag(node, true);
					break;
				default:
					// TODO: Read htmlparser2 source and see if there even **are** other types
					console.log(node);
					throw "Unexpected type: " + node.type;
			}
		} while (node = node.next)
	})(dom[0], 0);
}

function printTag(tag, end, selfClosing)
{
	if (end)
	{
		return "</" + tag.name + ">";
	}
	else
	{
		let retVal = "<" + tag.name;
		let attribs = Object.keys(tag.attribs);
		for (var i = 0; i < attribs.length; i++)
		{
			// TODO: stop the async="" attributes
			if (booleanAttributes.indexOf(attribs[i]) !== -1)
			{
				retVal += " " + attribs[i];
			}
			else
			{
				retVal += " " + attribs[i] + "=\"" + tag.attribs[attribs[i]] + "\"";
			}
		}
		if (selfClosing)
		{
			if (selfClosingHtmlTags.indexOf(tag.name) !== -1)
			{
				return retVal + " />";
			}
			else
			{
				// Although this tag contains no content, it can't self-close per the HTML spec
				// Attempting to self-close it could lead to weird browser quirks
				return retVal + "></" + tag.name + ">";
			}
		}
		else
		{
			return retVal + ">";
		}
	}
}

output += endingPHPTag;

// Remove starting and ending new-lines
// ... but leave one
output = output.trim() + "\n";

// Trailing new-line at end of file
fs.writeFileSync(process.argv[2], output, 'utf8');
