import { useState } from 'react';
import { X, Send, User, Building2, Mail, MessageSquare, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface MacnicaExpertDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  aiAnswer: string;
  className?: string;
}

interface ContactForm {
  name: string;
  company: string;
  email: string;
  additionalDetails: string;
}

export default function MacnicaExpertDrawer({
  isOpen,
  onClose,
  question,
  aiAnswer,
  className
}: MacnicaExpertDrawerProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState<ContactForm>({
    name: '',
    company: '',
    email: '',
    additionalDetails: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // Simulate API call to Macnica support system
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would send to:
      // - Email system
      // - CRM integration
      // - Support ticket system
      
      setStatus('success');
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setForm({ name: '', company: '', email: '', additionalDetails: '' });
      }, 3000);
      
    } catch (error) {
      setStatus('error');
      setErrorMessage('Could not send request. Please retry or email support@macnica.co.jp');
    }
  };

  const isFormValid = form.name.trim() && form.company.trim() && form.email.trim();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex" style={{ zIndex: 9999 }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="ml-auto w-[600px] bg-white dark:bg-gray-900 shadow-xl flex flex-col h-screen relative z-10">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-6 z-20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('macnicaExpert.title')}</h2>
                <p className="text-gray-600 dark:text-gray-400">{t('macnicaExpert.subtitle')}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800">
              {t('macnicaExpert.expertSupport')}
            </Badge>
            <Badge variant="outline">
              {t('macnicaExpert.responseTime')}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {status === 'success' ? (
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">{t('macnicaExpert.successTitle')}</h3>
                    <p className="text-green-800 dark:text-green-300 mt-2">
                      {t('macnicaExpert.successMessage')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : status === 'error' ? (
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 dark:text-red-100">{t('macnicaExpert.errorTitle')}</h3>
                    <p className="text-red-800 dark:text-red-300 mt-1">{errorMessage}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStatus('idle')}
                      className="mt-3 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      {t('macnicaExpert.tryAgain')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Context Cards */}
              <div className="space-y-4">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="dark:text-gray-200">{t('macnicaExpert.yourQuestion')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">"{question}"</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="dark:text-gray-200">{t('macnicaExpert.aiResponse')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto">
                      {aiAnswer.split('\n').slice(0, 3).map((line, index) => (
                        <p key={index} className="mb-1">{line}</p>
                      ))}
                      {aiAnswer.split('\n').length > 3 && (
                        <p className="text-gray-500 dark:text-gray-400 italic">{t('macnicaExpert.truncated')}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      {t('macnicaExpert.fullName')} {t('macnicaExpert.requiredField')}
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={t('macnicaExpert.namePlaceholder')}
                      required
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">
                      {t('macnicaExpert.company')} {t('macnicaExpert.requiredField')}
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      value={form.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder={t('macnicaExpert.companyPlaceholder')}
                      required
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t('macnicaExpert.email')} {t('macnicaExpert.requiredField')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={t('macnicaExpert.emailPlaceholder')}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details" className="text-sm font-medium">
                    {t('macnicaExpert.additionalDetails')}
                  </Label>
                  <Textarea
                    id="details"
                    value={form.additionalDetails}
                    onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
                    placeholder={t('macnicaExpert.detailsPlaceholder')}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={onClose}>
                      {t('macnicaExpert.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isFormValid || status === 'submitting'}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6"
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {t('macnicaExpert.sending')}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t('macnicaExpert.send')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>

              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="mb-1">
                  <strong className="dark:text-gray-300">{t('macnicaExpert.privacyNotice')}</strong> {t('macnicaExpert.privacyText')}
                </p>
                <p>
                  {t('macnicaExpert.urgentMatters')}{' '}
                  <a href="mailto:support@macnica.co.jp" className="text-blue-600 dark:text-blue-400 hover:underline">
                    support@macnica.co.jp
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}