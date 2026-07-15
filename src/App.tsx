import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AppShell } from './components/AppShell'
import { DashboardPage, LoginPage, NewExercisePage } from './pages/CorePages'
import { ChatPage, CorrectionPage, HistoryPage, ProgressPage, ReviewPage } from './pages/StudyPages'
import { NotFoundPage, PrivacyPage, ProfilePage, SettingsPage, TermsPage } from './pages/AccountPages'

export default function App() {
  const Router = import.meta.env.BASE_URL === '/' ? BrowserRouter : HashRouter
  return <AppProvider><Router><Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/termini" element={<TermsPage />} />
    <Route path="/app" element={<AppShell />}>
      <Route index element={<DashboardPage />} />
      <Route path="nuovo" element={<NewExercisePage />} />
      <Route path="correzioni" element={<HistoryPage />} />
      <Route path="correzione/:id" element={<CorrectionPage />} />
      <Route path="progressi" element={<ProgressPage />} />
      <Route path="ripassare" element={<ReviewPage />} />
      <Route path="chat" element={<ChatPage />} />
      <Route path="profilo" element={<ProfilePage />} />
      <Route path="impostazioni" element={<SettingsPage />} />
    </Route>
    <Route path="/home" element={<Navigate to="/app" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></Router></AppProvider>
}
