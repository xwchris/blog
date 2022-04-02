
export const escapeHTML = str =>
	str
		.replace(/&/g, '&amp;')
		.replace(/>/g, '&gt;')
		.replace(/</g, '&lt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

export const optimizeNodes = (data, regexp, replacer) => {
	let count = 0;
	let output = data;
	do {
		output = output.replace(regexp, replacer);
		count = 0;
		while (regexp.exec(output) !== null) ++count;
	} while (count > 0);
	return output;
};

/** Optimizes all nodes in an HTML string.
 * @param {string} html - The HTML string to be optimized.
 */
export const optimizeAllNodes = html => {
	let output = html;
	// Optimize punctuation nodes
	output = optimizeNodes(
		output,
		/<span class="token punctuation">([^\0<]*?)<\/span>([\n\r\s]*)<span class="token punctuation">([^\0]*?)<\/span>/gm,
		(match, p1, p2, p3) =>
			`<span class="token punctuation">${p1}${p2}${p3}</span>`
	);
	// Optimize operator nodes
	output = optimizeNodes(
		output,
		/<span class="token operator">([^\0<]*?)<\/span>([\n\r\s]*)<span class="token operator">([^\0]*?)<\/span>/gm,
		(match, p1, p2, p3) => `<span class="token operator">${p1}${p2}${p3}</span>`
	);
	// Optimize keyword nodes
	output = optimizeNodes(
		output,
		/<span class="token keyword">([^\0<]*?)<\/span>([\n\r\s]*)<span class="token keyword">([^\0]*?)<\/span>/gm,
		(match, p1, p2, p3) => `<span class="token keyword">${p1}${p2}${p3}</span>`
	);
	return output;
};