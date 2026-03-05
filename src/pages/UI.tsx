import React, { useState } from 'react';

/**
 * Tailwind 控件展示组件（含 cursor-pointer 样式）
 * 包含常用表单控件，并演示了状态管理
 */
const ControlsShowcase: React.FC = () => {
  // 状态管理
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('option1');
  const [isChecked, setIsChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('optionA');
  const [isToggled, setIsToggled] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* 标题 */}
      <h1 className="text-2xl font-bold text-gray-800">Tailwind 控件示例</h1>

      {/* 1. 按钮系列 - 已添加 cursor-pointer */}
      <section>
        <h2 className="text-lg font-semibold mb-3">按钮</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            主要按钮
          </button>
          <button className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
            次要按钮
          </button>
          <button className="cursor-pointer border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            轮廓按钮
          </button>
          <button className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            危险按钮
          </button>
          <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 text-lg rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            大号按钮
          </button>
          <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 text-sm rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            小号按钮
          </button>
          <button disabled className="bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded-lg cursor-not-allowed">
            禁用按钮
          </button>
        </div>
      </section>

      {/* 2. 文本输入框 */}
      <section>
        <h2 className="text-lg font-semibold mb-3">文本输入框</h2>
        <div className="space-y-4 max-w-md">
          {/* 基础输入框 */}
          <input
            type="text"
            placeholder="普通输入框"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          {/* 带图标的搜索框 */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="搜索..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 错误状态输入框 */}
          <input
            type="text"
            placeholder="错误状态"
            value="错误内容"
            readOnly
            className="w-full px-4 py-2 border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />

          {/* 禁用输入框 */}
          <input
            type="text"
            placeholder="禁用输入框"
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />

          {/* 文本域 */}
          <textarea
            rows={3}
            placeholder="多行文本域"
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          />
        </div>
      </section>

      {/* 3. 选择框 - 添加 cursor-pointer */}
      <section>
        <h2 className="text-lg font-semibold mb-3">选择框</h2>
        <div className="max-w-md">
          <select
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            className="cursor-pointer appearance-none w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23333\' stroke-width=\'2\'><polyline points=\'6 9 12 15 18 9\'/></svg>')] bg-no-repeat bg-right-4 bg-center"
          >
            <option value="option1">选项一</option>
            <option value="option2">选项二</option>
            <option value="option3">选项三</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">当前选择：{selectValue}</p>
        </div>
      </section>

      {/* 4. 复选框、单选框 - 标签已含 cursor-pointer */}
      <section>
        <h2 className="text-lg font-semibold mb-3">复选框 & 单选框</h2>
        <div className="space-y-4">
          {/* 复选框 */}
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="sr-only peer"
            />
            <span className="w-4 h-4 border border-gray-300 rounded bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition">
              <svg className="w-3 h-3 text-white hidden peer-checked:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="ml-2 text-gray-700">记住我（状态：{isChecked ? '选中' : '未选'}）</span>
          </label>

          {/* 单选框组 */}
          <div className="space-y-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="radio-group"
                value="optionA"
                checked={radioValue === 'optionA'}
                onChange={(e) => setRadioValue(e.target.value)}
                className="sr-only peer"
              />
              <span className="w-4 h-4 border border-gray-300 rounded-full bg-white peer-checked:border-blue-600 peer-checked:border-4"></span>
              <span className="ml-2 text-gray-700">选项 A</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="radio-group"
                value="optionB"
                checked={radioValue === 'optionB'}
                onChange={(e) => setRadioValue(e.target.value)}
                className="sr-only peer"
              />
              <span className="w-4 h-4 border border-gray-300 rounded-full bg-white peer-checked:border-blue-600 peer-checked:border-4"></span>
              <span className="ml-2 text-gray-700">选项 B</span>
            </label>
            <p className="text-sm text-gray-500">当前选中：{radioValue}</p>
          </div>

          {/* 带焦点效果的复选框 */}
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <span className="w-4 h-4 border border-gray-300 rounded bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition 
                           peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2">
              <svg className="w-3 h-3 text-white hidden peer-checked:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="ml-2 text-gray-700">带焦点环的复选框</span>
          </label>
        </div>
      </section>

      {/* 5. 切换开关 - 标签已含 cursor-pointer */}
      <section>
        <h2 className="text-lg font-semibold mb-3">切换开关</h2>
        <div className="space-y-3">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isToggled}
              onChange={(e) => setIsToggled(e.target.checked)}
              className="sr-only peer"
            />
            <span className="relative w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200">
              <span className="absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform duration-200"></span>
            </span>
            <span className="ml-3 text-gray-700">开启通知（当前：{isToggled ? '开' : '关'}）</span>
          </label>

          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <span className="relative w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200 peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2">
              <span className="absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform duration-200"></span>
            </span>
            <span className="ml-3 text-gray-700">带焦点环的切换</span>
          </label>
        </div>
      </section>

      {/* 6. 组合示例：登录表单 - 按钮添加 cursor-pointer */}
      <section>
        <h2 className="text-lg font-semibold mb-3">登录表单示例</h2>
        <div className="max-w-md border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-4">登录</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                id="password"
                type="password"
                placeholder="······"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                <span className="w-4 h-4 border border-gray-300 rounded bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white hidden peer-checked:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="ml-2 text-sm text-gray-600">记住我</span>
              </label>
              <a href="#" className="cursor-pointer text-sm text-blue-600 hover:underline">忘记密码？</a>
            </div>
            <button className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              登录
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ControlsShowcase;

/**
 * 以上是我用 tailwindcss 创建的一个控件展示组件，包含了按钮、输入框、选择框、复选框、单选框、切换开关等常用控件，
 * 每个控件都演示了基本的状态管理，方便你在实际项目中参考和使用。
 * 接下来，你必须根据我设计的这些样式作为基础，帮我设计页面，并且在设计过程中，必须保持这些样式的统一性和一致性，不能随意更改这些样式。
 */