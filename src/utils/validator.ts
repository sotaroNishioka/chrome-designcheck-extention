import type { DesignRule, ValidationResult } from "../types/rules";

const isValidNumber = (
	value: number,
	rule: string[],
	isMulti: boolean,
): boolean => {
	if (isMulti) {
		// 配列が空の場合はtrueを返す
		if (rule.length === 0) {
			return true;
		}
		// valueの値がruleの倍数であるかどうかを判定。倍数でない場合はfalseを返す
		return rule.some((r) => value % Number.parseInt(r) === 0);
	}
	// 配列が空の場合はtrueを返す
	if (rule.length === 0) {
		return true;
	}
	// valueの値がruleに含まれているかどうかを判定。含まれていない場合はfalseを返す
	return rule.includes(value.toString());
};

// パディングのバリデーション
function validatePadding(element: HTMLElement, rules: DesignRule): string[] {
	if (rules.padding === undefined && rules.paddingMultiple === undefined) {
		return [];
	}

	const violations: string[] = [];
	const computedStyle = window.getComputedStyle(element);

	const padding = {
		top: Number.parseInt(computedStyle.paddingTop),
		right: Number.parseInt(computedStyle.paddingRight),
		bottom: Number.parseInt(computedStyle.paddingBottom),
		left: Number.parseInt(computedStyle.paddingLeft),
	};

	if (
		padding.top === 0 &&
		padding.right === 0 &&
		padding.bottom === 0 &&
		padding.left === 0
	) {
		return [];
	}

	if (rules.padding === undefined && rules.paddingMultiple !== undefined) {
		if (!isValidNumber(padding.top, rules.paddingMultiple, true)) {
			violations.push(
				`padding-top: ${padding.top}px は許可された値ではありません`,
			);
		}
		if (!isValidNumber(padding.right, rules.paddingMultiple, true)) {
			violations.push(
				`padding-right: ${padding.right}px は許可された値ではありません`,
			);
		}
		if (!isValidNumber(padding.bottom, rules.paddingMultiple, true)) {
			violations.push(
				`padding-bottom: ${padding.bottom}px は許可された値ではありません`,
			);
		}
		if (!isValidNumber(padding.left, rules.paddingMultiple, true)) {
			violations.push(
				`padding-left: ${padding.left}px は許可された値ではありません`,
			);
		}
	}

	if (rules.padding !== undefined && rules.paddingMultiple === undefined) {
		if (!isValidNumber(padding.top, rules.padding, false)) {
			violations.push(
				`padding-top: ${padding.top}px は許可された値ではありません`,
			);
		}
		if (!isValidNumber(padding.right, rules.padding, false)) {
			violations.push(
				`padding-right: ${padding.right}px は許可された値ではありません`,
			);
		}
		if (!isValidNumber(padding.bottom, rules.padding, false)) {
			violations.push(
				`padding-bottom: ${padding.bottom}px は許可された値ではありません`,
			);
		}
		if (!isValidNumber(padding.left, rules.padding, false)) {
			violations.push(
				`padding-left: ${padding.left}px は許可された値ではありません`,
			);
		}
	}

	if (rules.padding !== undefined && rules.paddingMultiple !== undefined) {
		if (
			!isValidNumber(padding.top, rules.padding, false) &&
			!isValidNumber(padding.top, rules.paddingMultiple, true)
		) {
			violations.push(
				`padding-top: ${padding.top}px は許可された値ではありません`,
			);
		}
		if (
			!isValidNumber(padding.right, rules.padding, false) &&
			!isValidNumber(padding.right, rules.paddingMultiple, true)
		) {
			violations.push(
				`padding-right: ${padding.right}px は許可された値ではありません`,
			);
		}
		if (
			!isValidNumber(padding.bottom, rules.padding, false) &&
			!isValidNumber(padding.bottom, rules.paddingMultiple, true)
		) {
			violations.push(
				`padding-bottom: ${padding.bottom}px は許可された値ではありません`,
			);
		}
		if (
			!isValidNumber(padding.left, rules.padding, false) &&
			!isValidNumber(padding.left, rules.paddingMultiple, true)
		) {
			violations.push(
				`padding-left: ${padding.left}px は許可された値ではありません`,
			);
		}
	}

	return violations;
}

// マージンのバリデーション
function validateMargin(element: HTMLElement, rules: DesignRule): string[] {
	if (rules.margin === undefined && rules.marginMultiple === undefined) {
		return [];
	}

	const violations: string[] = [];
	const computedStyle = window.getComputedStyle(element);

	const margin = {
		top: Number.parseInt(computedStyle.marginTop),
		right: Number.parseInt(computedStyle.marginRight),
		bottom: Number.parseInt(computedStyle.marginBottom),
		left: Number.parseInt(computedStyle.marginLeft),
	};

	if (
		margin.top === 0 &&
		margin.right === 0 &&
		margin.bottom === 0 &&
		margin.left === 0
	) {
		return [];
	}

	if (rules.margin === undefined && rules.marginMultiple !== undefined) {
		if (!isValidNumber(margin.top, rules.marginMultiple, true)) {
			violations.push(
				`margin-top: ${margin.top}px は許可された値ではありません`,
			);
		}
		if (!isValidNumber(margin.right, rules.marginMultiple, true)) {
			violations.push(
				`margin-right: ${margin.right}px は許可された値ではありません`,
			);
		}
		if (!isValidNumber(margin.bottom, rules.marginMultiple, true)) {
			violations.push(
				`margin-bottom: ${margin.bottom}px は許可された値ではありません`,
			);
		}
		if (!isValidNumber(margin.left, rules.marginMultiple, true)) {
			violations.push(
				`margin-left: ${margin.left}px は許可された値ではありません`,
			);
		}
	}

	if (rules.margin !== undefined && rules.marginMultiple === undefined) {
		if (!isValidNumber(margin.top, rules.margin, false)) {
			violations.push(
				`margin-top: ${margin.top}px は許可された値ではありません`,
			);
		}
		if (!isValidNumber(margin.right, rules.margin, false)) {
			violations.push(
				`margin-right: ${margin.right}px は許可された値ではありません`,
			);
		}
		if (!isValidNumber(margin.bottom, rules.margin, false)) {
			violations.push(
				`margin-bottom: ${margin.bottom}px は許可された値ではありません`,
			);
		}
		if (!isValidNumber(margin.left, rules.margin, false)) {
			violations.push(
				`margin-left: ${margin.left}px は許可された値ではありません`,
			);
		}
	}

	if (rules.margin !== undefined && rules.marginMultiple !== undefined) {
		if (
			!isValidNumber(margin.top, rules.margin, false) &&
			!isValidNumber(margin.top, rules.marginMultiple, true)
		) {
			violations.push(
				`margin-top: ${margin.top}px は許可された値ではありません`,
			);
		}
		if (
			!isValidNumber(margin.right, rules.margin, false) &&
			!isValidNumber(margin.right, rules.marginMultiple, true)
		) {
			violations.push(
				`margin-right: ${margin.right}px は許可された値ではありません`,
			);
		}
		if (
			!isValidNumber(margin.bottom, rules.margin, false) &&
			!isValidNumber(margin.bottom, rules.marginMultiple, true)
		) {
			violations.push(
				`margin-bottom: ${margin.bottom}px は許可された値ではありません`,
			);
		}
		if (
			!isValidNumber(margin.left, rules.margin, false) &&
			!isValidNumber(margin.left, rules.marginMultiple, true)
		) {
			violations.push(
				`margin-left: ${margin.left}px は許可された値ではありません`,
			);
		}
	}

	return violations;
}

function validateFonts(element: HTMLElement, rules: DesignRule): string[] {
	if (rules.fonts === undefined || rules.fonts.length === 0) {
		return [];
	}
	const computedStyle = window.getComputedStyle(element);
	if (!computedStyle.fontFamily) {
		return [];
	}
	const violations: string[] = [];
	const fontFamily = computedStyle.fontFamily;

	const fontFamilyList = fontFamily
		.split(",")
		.map((font) => font.trim().replace(/"/g, "").toLowerCase());
	const rulesFontsLower = rules.fonts.map((font) => font.toLowerCase());

	if (!rulesFontsLower.some((ruleFont) => fontFamilyList.includes(ruleFont))) {
		violations.push(`font-family ${fontFamily} は許可された値ではありません`);
	}

	return violations;
}

// フォントサイズのバリデーション
function validateFontSize(element: HTMLElement, rules: DesignRule): string[] {
	if (rules.fontSize === undefined && rules.fontSizeMultiple === undefined) {
		return [];
	}
	const computedStyle = window.getComputedStyle(element);
	if (!computedStyle.fontSize) {
		return [];
	}
	const violations: string[] = [];
	const fontSize = Number.parseInt(computedStyle.fontSize);

	if (
		rules.fontSizeMultiple &&
		rules.fontSize === undefined &&
		!isValidNumber(fontSize, rules.fontSizeMultiple, true)
	) {
		violations.push(`font-size ${fontSize}px は許可された値ではありません`);
	}
	if (
		rules.fontSizeMultiple === undefined &&
		rules.fontSize &&
		!isValidNumber(fontSize, rules.fontSize, false)
	) {
		violations.push(`font-size ${fontSize}px は許可された値ではありません`);
	}
	if (rules.fontSizeMultiple && rules.fontSize) {
		if (
			!isValidNumber(fontSize, rules.fontSize, false) &&
			!isValidNumber(fontSize, rules.fontSizeMultiple, true)
		) {
			violations.push(`font-size ${fontSize}px は許可された値ではありません`);
		}
	}
	return violations;
}

function validateFontWeight(element: HTMLElement, rules: DesignRule): string[] {
	if (
		rules.fontWeightMultiple === undefined ||
		rules.fontWeightMultiple.length === 0
	) {
		return [];
	}
	const computedStyle = window.getComputedStyle(element);
	if (!computedStyle.fontWeight) {
		return [];
	}
	const violations: string[] = [];
	const fontWeight = computedStyle.fontWeight;

	if (!rules.fontWeightMultiple.some((x) => fontWeight === x)) {
		violations.push(`font-weight ${fontWeight} は許可された値ではありません`);
	}

	return violations;
}

// フォントカラーのバリデーション
function validateFontColor(element: HTMLElement, rules: DesignRule): string[] {
	if (rules.fontColor === undefined) {
		return [];
	}
	const computedStyle = window.getComputedStyle(element);
	if (!computedStyle.color) {
		return [];
	}
	const violations: string[] = [];
	const color = rgbToHex(computedStyle.color);

	if (!rules.fontColor.some((x) => color === x)) {
		violations.push(`color ${color} は許可された値ではありません`);
	}

	return violations;
}

// 背景色のバリデーション
function validateBackgroundColor(
	element: HTMLElement,
	rules: DesignRule,
): string[] {
	if (rules.backgroundColor === undefined) {
		return [];
	}
	const computedStyle = window.getComputedStyle(element);
	if (!computedStyle.backgroundColor) {
		return [];
	}
	const violations: string[] = [];
	const backgroundColor = rgbToHex(computedStyle.backgroundColor);

	if (!rules.backgroundColor.some((x) => backgroundColor === x)) {
		violations.push(
			`background-color ${backgroundColor} は許可された値ではありません`,
		);
	}

	return violations;
}

// ボーダーカラーのバリデーション
function validateBorderColor(
	element: HTMLElement,
	rules: DesignRule,
): string[] {
	if (rules.borderColor === undefined) {
		return [];
	}
	const computedStyle = window.getComputedStyle(element);
	if (!computedStyle.borderColor) {
		return [];
	}
	const violations: string[] = [];
	const borderColor = rgbToHex(computedStyle.borderColor);

	if (!rules.borderColor.some((x) => borderColor === x)) {
		violations.push(`border-color ${borderColor} は許可された値ではありません`);
	}

	return violations;
}

// ボーダー幅のバリデーション
function validateBorderWidth(
	element: HTMLElement,
	rules: DesignRule,
): string[] {
	if (rules.borderWidth === undefined) {
		return [];
	}
	const computedStyle = window.getComputedStyle(element);
	if (!computedStyle.borderWidth) {
		return [];
	}
	const violations: string[] = [];
	const borderWidth = Number.parseInt(computedStyle.borderWidth);

	if (!rules.borderWidth.some((x) => borderWidth === Number.parseInt(x))) {
		violations.push(
			`border-width ${borderWidth}px は許可された値ではありません`,
		);
	}
	return violations;
}

// RGBカラーを16進数カラーコードに変換
function rgbToHex(rgb: string): string {
	// rgb(r, g, b) 形式の文字列から数値を抽出
	const matches = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	if (!matches) return rgb;

	const r = Number.parseInt(matches[1]);
	const g = Number.parseInt(matches[2]);
	const b = Number.parseInt(matches[3]);

	// 16進数に変換
	const toHex = (n: number): string => {
		const hex = n.toString(16);
		return hex.length === 1 ? `0${hex}` : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// すべてのバリデーションを実行
export function validate(
	element: HTMLElement,
	rules: DesignRule,
): ValidationResult {
	const violations: string[] = [
		...validatePadding(element, rules),
		...validateMargin(element, rules),
		...validateFonts(element, rules),
		...validateFontSize(element, rules),
		...validateFontWeight(element, rules),
		...validateFontColor(element, rules),
		...validateBackgroundColor(element, rules),
		...validateBorderColor(element, rules),
		...validateBorderWidth(element, rules),
	];

	return {
		element,
		violations,
	};
}
