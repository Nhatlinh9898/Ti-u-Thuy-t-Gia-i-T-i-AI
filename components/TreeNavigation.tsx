import React from 'react';
import { NovelNode } from '../types';
import { ChevronRight, ChevronDown, FileText, Book, Folder, FolderOpen } from 'lucide-react';

interface TreeNavigationProps {
  node: NovelNode;
  selectedId: string;
  onSelect: (node: NovelNode) => void;
  onToggle: (node: NovelNode) => void;
}

const TreeNavigation: React.FC<TreeNavigationProps> = ({ node, selectedId, onSelect, onToggle }) => {
  const isSelected = node.id === selectedId;
  const hasChildren = node.children && node.children.length > 0;

  const getIcon = () => {
    if (node.type === 'novel') return <Book size={16} className="text-vip-gold" />;
    if (node.type === 'section') return <FileText size={14} className="text-blue-400" />;
    return node.isExpanded ? <FolderOpen size={14} className="text-vip-300" /> : <Folder size={14} className="text-vip-300" />;
  };

  return (
    <div className="select-none">
      <div 
        className={`
          flex items-center gap-1 py-1 px-2 cursor-pointer transition-colors rounded-r-md border-l-2
          ${isSelected 
            ? 'bg-vip-700/50 border-vip-gold text-white' 
            : 'border-transparent text-gray-400 hover:bg-vip-900/50 hover:text-gray-200'}
        `}
        style={{ paddingLeft: `${(node.type === 'novel' ? 0 : 1) * 12 + 8}px` }}
        onClick={() => onSelect(node)}
      >
        <div 
          className="p-1 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(node);
          }}
        >
          {hasChildren ? (
             node.isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          ) : <span className="w-3 block"></span>}
        </div>
        
        {getIcon()}
        
        <span className={`text-sm truncate ml-1 ${node.type === 'novel' ? 'font-bold font-serif uppercase tracking-widest' : ''}`}>
          {node.title}
        </span>
      </div>

      {node.isExpanded && hasChildren && (
        <div className="ml-2 border-l border-vip-700/30">
          {node.children.map(child => (
            <TreeNavigation 
              key={child.id} 
              node={child} 
              selectedId={selectedId} 
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNavigation;
