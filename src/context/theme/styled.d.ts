// styled.d.ts (프로젝트 루트 or src 하위)
import 'styled-components/native';
import type { ThemeColors } from './colors.ts';

declare module 'styled-components/native' {
    // RN에서도 DefaultTheme 사용
    export interface DefaultTheme extends ThemeColors {}
}