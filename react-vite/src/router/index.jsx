import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Card from '../components/Cards/Card';
import CreateCardModal from '../components/Cards/CreateCardModal';
import CardDetailsModal from '../components/cards/CardDetailsModal';
import BoardViewPage from '../components/boards/BoardViewPage';
import BoardListPage from '../components/boards/BoardListPage';
import Layout from './Layout';
// import { Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <BoardListPage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "boards/:boardId",
        element: <BoardViewPage />,
      },
      {
        path: "boards/:boardId/cards/:cardId",
        element: <Card />,
      },
      {
        path: "cards/:cardId",
        element: <Card/>
      },
      {
        path: "boards/:boardId/cards/new",
        element: <CreateCardModal />,
      },
      {
        path: "cards/:cardId",
        element: <CardDetailsModal/>, 
      },
      // {
      //   path: "*",
      //   element: <Navigate to="/" replace={true} />,
      // },
    ],
  },
]);