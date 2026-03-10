import { NavLink } from "react-router";

function LinkComp({
  page,
  children,
}: {
  page: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={page}
      className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded-lg transition duration-200"
    >
      {children}
    </NavLink>
  );
}

export default function Sidebar({
  isModalOpen,
  closeDeleteModal,
}: {
  isModalOpen: boolean;
  closeDeleteModal: () => void;
}) {
  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto select-none">
          <div
            className="fixed inset-0 bg-gray-800/50 transition-opacity"
            onClick={closeDeleteModal}
          >
            <div className="flex min-h-full">
              <div
                className="bg-white p-6 rounded-b-lg flex flex-col gap-2 rounded-r-lg min-w-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <nav>
                  <LinkComp page="/">AI Scripts</LinkComp>
                  <LinkComp page="/ui">UI Elements</LinkComp>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
