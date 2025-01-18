import TowerQuestBase from "./pages/TowerQuestBase";
import { Toaster } from 'react-hot-toast';
export default function Home() {
  return (
    <>
         <Toaster position="top-center"/>
         <TowerQuestBase />
    </>
  );
}
