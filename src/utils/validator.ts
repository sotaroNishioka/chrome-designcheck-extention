import { DesignRule, ValidationResult } from '../types/rules';

// 値が倍数ルールに従っているかチェック
function checkMultiple(value: number, multiple: string[]): boolean {
  // 一つでも余りが0以外のものがあればfalseを返す
  return multiple.every(m => value % parseInt(m) === 0);
}

// パディングのバリデーション
function validatePadding(element: HTMLElement, rules: DesignRule): string[] {
  if (rules.padding === undefined && rules.paddingMultiple === undefined) {
    return [];
  }
  const violations: string[] = [];
  const computedStyle = window.getComputedStyle(element);
  const padding = parseInt(computedStyle.padding);
  console.log('Padding:', padding);
  const paddingTop = parseInt(computedStyle.paddingTop);
  const paddingRight = parseInt(computedStyle.paddingRight);
  const paddingBottom = parseInt(computedStyle.paddingBottom);
  const paddingLeft = parseInt(computedStyle.paddingLeft);
  console.log('PaddingTop:', paddingTop);
  console.log('PaddingRight:', paddingRight);
  console.log('PaddingBottom:', paddingBottom);
  console.log('PaddingLeft:', paddingLeft);


  if (rules.paddingMultiple && rules.padding === undefined && !checkMultiple(padding, rules.paddingMultiple)) {
    violations.push(`パディング ${padding}px は ${rules.paddingMultiple} の倍数ではありません`);
  }

  if (rules.paddingMultiple === undefined && rules.padding && !rules.padding.includes(padding.toString())) {
    violations.push(`パディング ${padding}px は許可された値 (${rules.padding.join(', ')}) ではありません`);
  }

  if (rules.paddingMultiple && rules.padding && !rules.padding.includes(padding.toString())) {
    violations.push(`パディング ${padding}px は ${rules.paddingMultiple} の倍数でも許可された値でもありません`);
  }

  return violations;
}

// マージンのバリデーション
function validateMargin(element: HTMLElement, rules: DesignRule): string[] {
  if (!element.style.margin) {
    return [];
  }
  const violations: string[] = [];
  const computedStyle = window.getComputedStyle(element);
  const margin = parseInt(computedStyle.margin);

  if (rules.marginMultiple && rules.margin === undefined && !checkMultiple(margin, rules.marginMultiple)) {
    violations.push(`マージン ${margin}px は ${rules.marginMultiple} の倍数ではありません`);
  }

  if (rules.marginMultiple === undefined && rules.margin && !rules.margin.includes(margin.toString())) {
    violations.push(`マージン ${margin}px は許可された値 (${rules.margin.join(', ')}) ではありません`);
  }

  if (rules.marginMultiple && rules.margin && !rules.margin.includes(margin.toString())) {
    violations.push(`マージン ${margin}px は ${rules.marginMultiple} の倍数でも許可された値でもありません`);
  }

  return violations;
}

// フォントのバリデーション
function validateFonts(element: HTMLElement, rules: DesignRule): string[] {
  if (rules.fonts === undefined) {
    return [];
  }
  if (!element.style.fontFamily) {
    return [];
  }
  const violations: string[] = [];
  const computedStyle = window.getComputedStyle(element);
  const fontFamily = computedStyle.fontFamily;

  if (rules.fonts && !rules.fonts.some(font => fontFamily.includes(font))) {
    violations.push(`フォント "${fontFamily}" は許可された値 (${rules.fonts.join(', ')}) ではありません`);
  }

  return violations;
}

// フォントサイズのバリデーション
function validateFontSize(element: HTMLElement, rules: DesignRule): string[] {
  if (rules.fontSize === undefined) {
    return [];
  }
  if (!element.style.fontSize) {
    return [];
  }
  const violations: string[] = [];
  const computedStyle = window.getComputedStyle(element);
  const fontSize = parseInt(computedStyle.fontSize);

  if (rules.fontSizeMultiple && rules.fontSize === undefined && !checkMultiple(fontSize, rules.fontSizeMultiple)) {
    violations.push(`フォントサイズ ${fontSize}px は ${rules.fontSizeMultiple} の倍数ではありません`);
  }

  if (rules.fontSizeMultiple === undefined && rules.fontSize && !rules.fontSize.includes(fontSize.toString())) {
    violations.push(`フォントサイズ ${fontSize}px は許可された値 (${rules.fontSize.join(', ')}) ではありません`);
  }

  if (rules.fontSizeMultiple && rules.fontSize && !rules.fontSize.includes(fontSize.toString())) {
    violations.push(`フォントサイズ ${fontSize}px は ${rules.fontSizeMultiple} の倍数でも許可された値でもありません`);
  }

  return violations;
}

// フォントカラーのバリデーション
function validateFontColor(element: HTMLElement, rules: DesignRule): string[] {
  if (rules.fontColor === undefined) {
    return [];
  }
  if (!element.style.color) {
    return [];
  }
  const violations: string[] = [];
  const computedStyle = window.getComputedStyle(element);
  const color = rgbToHex(computedStyle.color);

  if (rules.fontColor && !rules.fontColor.includes(color)) {
    violations.push(`フォントカラー ${color} は許可された値 (${rules.fontColor.join(', ')}) ではありません`);
  }

  return violations;
}

// 背景色のバリデーション
function validateBackgroundColor(element: HTMLElement, rules: DesignRule): string[] {
  if (rules.backgroundColor === undefined) {
    return [];
  }
  if (!element.style.backgroundColor) {
    return [];
  }
  const violations: string[] = [];
  const computedStyle = window.getComputedStyle(element);
  const backgroundColor = rgbToHex(computedStyle.backgroundColor);

  if (rules.backgroundColor && !rules.backgroundColor.includes(backgroundColor)) {
    violations.push(`背景色 ${backgroundColor} は許可された値 (${rules.backgroundColor.join(', ')}) ではありません`);
  }

  return violations;
}

// ボーダーカラーのバリデーション
function validateBorderColor(element: HTMLElement, rules: DesignRule): string[] {
  if (rules.borderColor === undefined) {
    return [];
  }
  if (!element.style.borderColor) {
    return [];
  }
  const violations: string[] = [];
  const computedStyle = window.getComputedStyle(element);
  const borderColor = rgbToHex(computedStyle.borderColor);

  if (rules.borderColor && !rules.borderColor.includes(borderColor)) {
    violations.push(`ボーダーカラー ${borderColor} は許可された値 (${rules.borderColor.join(', ')}) ではありません`);
  }

  return violations;
}

// ボーダー幅のバリデーション
function validateBorderWidth(element: HTMLElement, rules: DesignRule): string[] {
  if (rules.borderWidth === undefined) {
    return [];
  }
  if (!element.style.borderWidth) {
    return [];
  }
  const violations: string[] = [];
  const computedStyle = window.getComputedStyle(element);
  const borderWidth = parseInt(computedStyle.borderWidth);

  if (rules.borderWidthMultiple && rules.borderWidth === undefined && !checkMultiple(borderWidth, rules.borderWidthMultiple)) {
    violations.push(`ボーダー幅 ${borderWidth}px は ${rules.borderWidthMultiple} の倍数ではありません`);
  }

  if (rules.borderWidthMultiple === undefined && rules.borderWidth && !rules.borderWidth.includes(borderWidth.toString())) {
    violations.push(`ボーダー幅 ${borderWidth}px は許可された値 (${rules.borderWidth.join(', ')}) ではありません`);
  }

  if (rules.borderWidthMultiple && rules.borderWidth && !rules.borderWidth.includes(borderWidth.toString())) {
    violations.push(`ボーダー幅 ${borderWidth}px は ${rules.borderWidthMultiple} の倍数でも許可された値でもありません`);
  }

  return violations;
}

// RGBカラーを16進数カラーコードに変換
function rgbToHex(rgb: string): string {
  // rgb(r, g, b) 形式の文字列から数値を抽出
  const matches = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!matches) return rgb;

  const r = parseInt(matches[1]);
  const g = parseInt(matches[2]);
  const b = parseInt(matches[3]);

  // 16進数に変換
  const toHex = (n: number): string => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return '#' + toHex(r) + toHex(g) + toHex(b);
}

// すべてのバリデーションを実行
export function validate(element: HTMLElement, rules: DesignRule): ValidationResult {
  console.log('Validating element:');
  console.log(rules);
  const violations: string[] = [
    ...validatePadding(element, rules),
    ...validateMargin(element, rules),
    ...validateFonts(element, rules),
    ...validateFontSize(element, rules),
    ...validateFontColor(element, rules),
    ...validateBackgroundColor(element, rules),
    ...validateBorderColor(element, rules),
    ...validateBorderWidth(element, rules)
  ];

  return {
    element,
    violations
  };
}
