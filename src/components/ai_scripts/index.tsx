import { AiScript } from "../../common";

export const AiScriptItem = ({
  script,
  onEdit,
  onDelete,
}: {
  script: AiScript;
  onEdit: (script: AiScript) => void;
  onDelete: (script: AiScript) => void;
}) => {
  return (
    <div
      key={script.id}
      className="flex flex-col sm:flex-row sm:items-start justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow transition"
    >
      {/* 左侧信息 - 文字左对齐 */}
      <div className="flex-1 mb-3 sm:mb-0 sm:mr-4">
        <h3 className="font-medium text-gray-900 text-lg text-left">
          {script.name}
        </h3>
        {/* <p className="text-sm text-gray-600 line-clamp-2 mt-1 font-mono whitespace-pre-wrap text-left">
          {script.content}
        </p> */}
      </div>

      {/* 右侧操作按钮 */}
      <div className="flex gap-2 shrink-0 self-end sm:self-center">
        <button
          onClick={() => onEdit(script)}
          className="cursor-pointer border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-1 px-3 text-sm rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          编辑
        </button>
        <button
          onClick={() => onDelete(script)}
          className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 text-sm rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          删除
        </button>
      </div>
    </div>
  );
};

export function Pagtaion({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`cursor-pointer px-4 py-2 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            上一页
          </button>
          <span className="text-sm text-gray-700">
            第 {currentPage} / {totalPages} 页
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`cursor-pointer px-4 py-2 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            下一页
          </button>
        </div>
      )}
    </>
  );
}
