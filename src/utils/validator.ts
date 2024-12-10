import { DesignRule, ValidationResult } from '../types/rules';

export class StyleValidator {
  private rules: DesignRule;

  constructor(rules: DesignRule) {
    this.rules = rules;
  }

  // 値が倍数ルールに従っているかチェック
  private checkMultiple(value: number, multiple: number): boolean {
    return value % multiple === 0;
  }

  // パディングのバリデーション
  private validatePadding(element: HTMLElement): string[] {
    const violations: string[] = [];
    const computedStyle = window.getComputedStyle(element);
    const padding = parseInt(computedStyle.padding);

    if (this.rules.paddingMultiple && !this.checkMultiple(padding, this.rules.paddingMultiple)) {
      violations.push(`パディング ${padding}px は ${this.rules.paddingMultiple} の倍数ではありません`);
    }

    if (this.rules.padding && !this.rules.padding.includes(padding.toString())) {
      violations.push(`パディング ${padding}px は許可された値 (${this.rules.padding.join(', ')}) ではありません`);
    }

    return violations;
  }

  // マージンのバリデーション
  private validateMargin(element: HTMLElement): string[] {
    const violations: string[] = [];
    const computedStyle = window.getComputedStyle(element);
    const margin = parseInt(computedStyle.margin);

    if (this.rules.marginMultiple && !this.checkMultiple(margin, this.rules.marginMultiple)) {
      violations.push(`マージン ${margin}px は ${this.rules.marginMultiple} の倍数ではありません`);
    }

    if (this.rules.margin && !this.rules.margin.includes(margin.toString())) {
      violations.push(`マージン ${margin}px は許可された値 (${this.rules.margin.join(', ')}) ではありません`);
    }

    return violations;
  }

  // フォントのバリデーション
  private validateFonts(element: HTMLElement): string[] {
    const violations: string[] = [];
    const computedStyle = window.getComputedStyle(element);
    const fontFamily = computedStyle.fontFamily;

    if (this.rules.fonts && !this.rules.fonts.some(font => fontFamily.includes(font))) {
      violations.push(`フォント "${fontFamily}" は許可された値 (${this.rules.fonts.join(', ')}) ではありません`);
    }

    return violations;
  }

  // フォントサイズのバリデーション
  private validateFontSize(element: HTMLElement): string[] {
    const violations: string[] = [];
    const computedStyle = window.getComputedStyle(element);
    const fontSize = parseInt(computedStyle.fontSize);

    if (this.rules.fontSizeMultiple && !this.checkMultiple(fontSize, this.rules.fontSizeMultiple)) {
      violations.push(`フォントサイズ ${fontSize}px は ${this.rules.fontSizeMultiple} の倍数ではありません`);
    }

    if (this.rules.fontSize && !this.rules.fontSize.includes(fontSize.toString())) {
      violations.push(`フォントサイズ ${fontSize}px は許可された値 (${this.rules.fontSize.join(', ')}) ではありません`);
    }

    return violations;
  }

  // フォントカラーのバリデーション
  private validateFontColor(element: HTMLElement): string[] {
    const violations: string[] = [];
    const computedStyle = window.getComputedStyle(element);
    const color = this.rgbToHex(computedStyle.color);

    if (this.rules.fontColor && !this.rules.fontColor.includes(color)) {
      violations.push(`フォントカラー ${color} は許可された値 (${this.rules.fontColor.join(', ')}) ではありません`);
    }

    return violations;
  }

  // 背景色のバリデーション
  private validateBackgroundColor(element: HTMLElement): string[] {
    const violations: string[] = [];
    const computedStyle = window.getComputedStyle(element);
    const backgroundColor = this.rgbToHex(computedStyle.backgroundColor);

    if (this.rules.backgroundColor && !this.rules.backgroundColor.includes(backgroundColor)) {
      violations.push(`背景色 ${backgroundColor} は許可された値 (${this.rules.backgroundColor.join(', ')}) ではありません`);
    }

    return violations;
  }

  // ボーダーカラーのバリデーション
  private validateBorderColor(element: HTMLElement): string[] {
    const violations: string[] = [];
    const computedStyle = window.getComputedStyle(element);
    const borderColor = this.rgbToHex(computedStyle.borderColor);

    if (this.rules.borderColor && !this.rules.borderColor.includes(borderColor)) {
      violations.push(`ボーダーカラー ${borderColor} は許可された値 (${this.rules.borderColor.join(', ')}) ではありません`);
    }

    return violations;
  }

  // ボーダー幅のバリデーション
  private validateBorderWidth(element: HTMLElement): string[] {
    const violations: string[] = [];
    const computedStyle = window.getComputedStyle(element);
    const borderWidth = parseInt(computedStyle.borderWidth);

    if (this.rules.borderWidthMultiple && !this.checkMultiple(borderWidth, this.rules.borderWidthMultiple)) {
      violations.push(`ボーダー幅 ${borderWidth}px は ${this.rules.borderWidthMultiple} の倍数ではありません`);
    }

    if (this.rules.borderWidth && !this.rules.borderWidth.includes(borderWidth.toString())) {
      violations.push(`ボーダー幅 ${borderWidth}px は許可された値 (${this.rules.borderWidth.join(', ')}) ではありません`);
    }

    return violations;
  }

  // RGBカラーを16進数カラーコードに変換
  private rgbToHex(rgb: string): string {
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
  public validate(element: HTMLElement): ValidationResult {
    const violations: string[] = [
      ...this.validatePadding(element),
      ...this.validateMargin(element),
      ...this.validateFonts(element),
      ...this.validateFontSize(element),
      ...this.validateFontColor(element),
      ...this.validateBackgroundColor(element),
      ...this.validateBorderColor(element),
      ...this.validateBorderWidth(element)
    ];

    return {
      element,
      violations
    };
  }
}