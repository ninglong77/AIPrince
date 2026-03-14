import React, { useState } from 'react';
import { PrimaryButton } from '../components/buttons';
import { SearchIcon } from '../components/icons';
import { AiScript } from '../common';
import { AiScriptItem, Pagtaion } from '../components/ai_scripts';
import { NavLink } from 'react-router';

/**
 * AiScript 增删改查管理页面
 * 布局：【新增】按钮 + 搜索框 | 下方列表（分页）
 * 新增/编辑通过全屏对话框完成，删除通过自定义确认对话框
 * 列表文字左对齐，遮罩使用灰色半透明
 */
const AiScriptManager: React.FC = () => {
  // 模拟初始数据
  const [scripts, setScripts] = useState<AiScript[]>([
    {
      id: '1',
      name: 'Hello World',
      content: 'print("Hello, world!")\n// 第一个脚本示例',
    },
    {
      id: '2',
      name: 'Fibonacci',
      content:
        'function fib(n) {\n  if (n <= 1) return n;\n  return fib(n-1) + fib(n-2);\n}',
    },
    {
      id: '3',
      name: '数组映射',
      content: 'const doubled = [1, 2, 3].map(x => x * 2);',
    },
    {
      id: '4',
      name: '递归示例',
      content: 'function factorial(n) {\n  if (n === 0) return 1;\n  return n * factorial(n-1);\n}',
    },
    {
      id: '5',
      name: 'Promise 示例',
      content: 'new Promise((resolve) => {\n  setTimeout(() => resolve("done"), 1000);\n}).then(console.log);',
    },
    {
      id: '6',
      name: '数组过滤',
      content: '[1, 2, 3, 4, 5].filter(x => x % 2 === 0);',
    },
  ]);

  // 搜索关键词
  const [searchTerm, setSearchTerm] = useState('');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 每页显示5条

  // 新增/编辑对话框相关状态
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', content: '' });

  // 删除确认对话框相关状态
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scriptToDelete, setScriptToDelete] = useState<AiScript | null>(null);

  // 打开新增对话框
  const openAddModal = () => {
    setFormData({ name: '', content: '' });
    setEditId(null);
    setIsFormModalOpen(true);
  };

  // 打开编辑对话框
  const openEditModal = (script: AiScript) => {
    setFormData({ name: script.name, content: script.content });
    setEditId(script.id);
    setIsFormModalOpen(true);
  };

  // 关闭新增/编辑对话框
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setFormData({ name: '', content: '' });
    setEditId(null);
  };

  // 打开删除确认对话框
  const openDeleteModal = (script: AiScript) => {
    setScriptToDelete(script);
    setIsDeleteModalOpen(true);
  };

  // 关闭删除确认对话框
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setScriptToDelete(null);
  };

  // 处理表单输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 保存脚本 (新增或更新)
  const handleSave = (formdata: { name: string, content: string }) => {
    if (!formdata.name.trim() || !formdata.content.trim()) {
      alert('请填写名称和内容');
      return;
    }

    if (editId) {
      // 更新
      setScripts((prev) =>
        prev.map((script) =>
          script.id === editId
            ? { ...script, name: formdata.name, content: formdata.content }
            : script
        )
      );
    } else {
      // 新增
      const newId = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 8);
      const newScript: AiScript = {
        id: newId,
        name: formdata.name,
        content: formdata.content,
      };
      setScripts((prev) => [newScript, ...prev]);
    }

    closeFormModal();
  };

  // 确认删除
  const confirmDelete = () => {
    if (scriptToDelete) {
      setScripts((prev) => prev.filter((script) => script.id !== scriptToDelete.id));
      closeDeleteModal();
    }
  };

  // 根据搜索词过滤脚本
  const filteredScripts = scripts.filter((script) =>
    script.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 分页计算
  const totalPages = Math.ceil(filteredScripts.length / itemsPerPage);
  const paginatedScripts = filteredScripts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 切换页码
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* 页面标题 */}
      <h1 className="text-2xl font-bold text-gray-800">AiScript 管理</h1>

      {/* 顶部工具栏：新增按钮 + 搜索框 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <NavLink to="/ai_scripts/new">
          <PrimaryButton onClick={openAddModal}>+ 新增脚本</PrimaryButton>
        </NavLink>
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <SearchIcon />
          </span>
          <input
            type="search"
            placeholder="按名称搜索..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // 搜索时重置到第一页
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 脚本列表 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">脚本列表</h2>
          <span className="text-sm text-gray-500">共 {filteredScripts.length} 条</span>
        </div>

        {filteredScripts.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-500">暂无脚本，请添加一条记录</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedScripts.map((script) => (
                <AiScriptItem script={script} onDelete={openDeleteModal} onEdit={openEditModal} />                
              ))}
            </div>

            {/* 分页控件 */}
            <Pagtaion currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </section>

      {/* 新增/编辑全屏对话框 - 遮罩使用灰色半透明 */}
      {/* {isFormModalOpen && (
        <NewAiScript editId={editId || undefined} /> 
      )} */}

      {/* 删除确认对话框 - 遮罩同样使用灰色半透明 */}
      {isDeleteModalOpen && scriptToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-800/50 transition-opacity" onClick={closeDeleteModal}></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 transform transition-all">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">确认删除</h3>
              <p className="text-gray-600 mb-6">
                确定要删除脚本 "<span className="font-medium text-gray-900">{scriptToDelete.name}</span>" 吗？此操作不可撤销。
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  确认删除
                </button>
              </div>
              <button
                onClick={closeDeleteModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 样式统一提示 */}
      <div className="text-xs text-gray-400 border-t pt-4 text-center">
        界面样式完全基于 ControlsShowcase 组件，所有控件样式保持一致。
      </div>
    </div>
  );
};

export default AiScriptManager;