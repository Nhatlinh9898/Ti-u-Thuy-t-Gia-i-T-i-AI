import { NovelNode } from '../types';

const STORAGE_KEY = 'novel-data';

export const saveToLocalStorage = (tree: NovelNode): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
    console.log('✅ Dữ liệu đã được lưu vào localStorage');
  } catch (error) {
    console.error('❌ Lỗi khi lưu dữ liệu:', error);
  }
};

export const loadFromLocalStorage = (): NovelNode | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      console.log('✅ Dữ liệu đã được tải từ localStorage');
      return parsed;
    }
  } catch (error) {
    console.error('❌ Lỗi khi tải dữ liệu:', error);
  }
  return null;
};

export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Dữ liệu đã được xóa khỏi localStorage');
  } catch (error) {
    console.error('❌ Lỗi khi xóa dữ liệu:', error);
  }
};

export const exportToFile = (tree: NovelNode): void => {
  try {
    const dataStr = JSON.stringify(tree, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `novel-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    console.log('✅ Dữ liệu đã được xuất ra file');
  } catch (error) {
    console.error('❌ Lỗi khi xuất file:', error);
  }
};

export const importFromFile = (): Promise<NovelNode | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          console.log('✅ Dữ liệu đã được nhập từ file');
          resolve(parsed);
        } catch (error) {
          console.error('❌ Lỗi khi đọc file:', error);
          resolve(null);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  });
};
