import React, { useEffect, useState } from 'react';
import { PrimaryButton } from '../components/buttons';
import { SearchIcon } from '../components/icons';
import { AiScript } from '../common';
import { AiScriptItem, Pagtaion } from '../components/ai_scripts';
import { NavLink, useNavigate } from 'react-router';
import { useAiScriptsStore } from '../states/ai_scripts';
import { remove_ai_script } from '../services/ai_scripts';
import { useNotification } from '../components/notification';

/**
 * AiScript 增删改查管理页面
 * 布局：【新增】按钮 + 搜索框 | 下方列表（分页）
 * 新增/编辑通过全屏对话框完成，删除通过自定义确认对话框
 * 列表文字左对齐，遮罩使用灰色半透明
 */
const AiScriptManager: React.FC = () => {
  const scripts = useAiScriptsStore((state) => state.ai_scripts);
  const { refresh } = useAiScriptsStore();
  const navigate = useNavigate();
  const notification = useNotification();

  // 搜索关键词
  const [searchTerm, setSearchTerm] = useState('');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 每页显示5条


  // 删除确认对话框相关状态
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scriptToDelete, setScriptToDelete] = useState<AiScript | null>(null);


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

  // 确认删除
  const confirmDelete = () => {
    if (scriptToDelete) {
      remove_ai_script(scriptToDelete.id as any).then(() => {
        closeDeleteModal();
        refresh().then(() => {
          notification.success("Successfully deleted AiScript")
        });
      }).catch(e => {
        notification.error("Failed to delete AiScript:"+e)
      });
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

  useEffect(() => {
    console.log('---->>>')
    refresh();
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* 页面标题 */}
      <h1 className="text-2xl font-bold text-gray-800">AiScript 管理</h1>
      {/* 顶部工具栏：新增按钮 + 搜索框 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <NavLink to="/ai_scripts/new">
          <PrimaryButton>+ 新增脚本</PrimaryButton>
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
                <AiScriptItem script={script} onDelete={openDeleteModal} onEdit={() => {
                  navigate(`/ai_scripts/edit/${script.id}`);
                }} />                
              ))}
            </div>

            {/* 分页控件 */}
            <Pagtaion currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </section>

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