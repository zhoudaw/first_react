import { create } from 'zustand';

export interface MenuStore {
  /**菜单关闭打开 */
  isCollapsed: boolean;
  /**菜单关闭打开执行函数 */
  toggleCollapsed: () => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  isCollapsed: JSON.parse(localStorage.getItem('isCollapsed') || 'false'),
  toggleCollapsed: () =>
    set((state) => {
      const newState = !state.isCollapsed;
      localStorage.setItem('isCollapsed', JSON.stringify(newState));
      return { isCollapsed: newState };
    }),
}));
