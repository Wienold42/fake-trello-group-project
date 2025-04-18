import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Card from '../components/Cards/Card';
import CreateCardForm from '../components/cards/CreateCardForm';
import CardDetailsModal from '../components/cards/CardDetailsModal';
import Layout from './Layout';
// import { Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
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
        path: "boards/:boardId/cards/:cardId",
        element: <Card />,
      },
      {
        path: "cards/:cardId",
        element: <Card/>
      },
      {
        path: "boards/:boardId/cards/new",
        element: <CreateCardForm />,
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