'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Save,
  Settings,
  User,
  Shield,
  Bell,
  Database,
  Globe,
  Key,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: SettingsField[];
}

interface SettingsField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
  value: any;
  placeholder?: string;
  options?: { value: string; label: string }[];
  description?: string;
  required?: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [activeSection, setActiveSection] = useState('general');

  const settingsSections: SettingsSection[] = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Basic system configuration and preferences',
      icon: Settings,
      fields: [
        {
          id: 'siteName',
          label: 'Site Name',
          type: 'text',
          value: settings.siteName || 'CV Builder',
          placeholder: 'Enter site name',
          description: 'The name displayed in the application header'
        },
        {
          id: 'siteDescription',
          label: 'Site Description',
          type: 'textarea',
          value: settings.siteDescription || 'Professional CV Builder with AI Assistance',
          placeholder: 'Enter site description',
          description: 'Brief description of your CV builder service'
        },
        {
          id: 'defaultLanguage',
          label: 'Default Language',
          type: 'select',
          value: settings.defaultLanguage || 'en',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
            { value: 'nl', label: 'Dutch' }
          ],
          description: 'Default language for new users'
        },
        {
          id: 'maintenanceMode',
          label: 'Maintenance Mode',
          type: 'checkbox',
          value: settings.maintenanceMode || false,
          description: 'Enable maintenance mode to temporarily disable the application'
        }
      ]
    },
    {
      id: 'user',
      title: 'User Management',
      description: 'User registration and authentication settings',
      icon: User,
      fields: [
        {
          id: 'allowRegistration',
          label: 'Allow User Registration',
          type: 'checkbox',
          value: settings.allowRegistration || true,
          description: 'Allow new users to register accounts'
        },
        {
          id: 'requireEmailVerification',
          label: 'Require Email Verification',
          type: 'checkbox',
          value: settings.requireEmailVerification || false,
          description: 'Require users to verify their email address'
        },
        {
          id: 'maxUsersPerDay',
          label: 'Max New Users Per Day',
          type: 'number',
          value: settings.maxUsersPerDay || 100,
          placeholder: '100',
          description: 'Maximum number of new user registrations per day'
        },
        {
          id: 'sessionTimeout',
          label: 'Session Timeout (minutes)',
          type: 'number',
          value: settings.sessionTimeout || 60,
          placeholder: '60',
          description: 'How long user sessions remain active'
        }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Security and privacy settings',
      icon: Shield,
      fields: [
        {
          id: 'enableTwoFactor',
          label: 'Enable Two-Factor Authentication',
          type: 'checkbox',
          value: settings.enableTwoFactor || false,
          description: 'Require two-factor authentication for admin accounts'
        },
        {
          id: 'passwordMinLength',
          label: 'Minimum Password Length',
          type: 'number',
          value: settings.passwordMinLength || 8,
          placeholder: '8',
          description: 'Minimum required password length'
        },
        {
          id: 'maxLoginAttempts',
          label: 'Max Login Attempts',
          type: 'number',
          value: settings.maxLoginAttempts || 5,
          placeholder: '5',
          description: 'Maximum failed login attempts before account lockout'
        },
        {
          id: 'enableAuditLog',
          label: 'Enable Audit Logging',
          type: 'checkbox',
          value: settings.enableAuditLog || true,
          description: 'Log all administrative actions for security auditing'
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Email and system notification settings',
      icon: Bell,
      fields: [
        {
          id: 'emailNotifications',
          label: 'Enable Email Notifications',
          type: 'checkbox',
          value: settings.emailNotifications || true,
          description: 'Send email notifications for important events'
        },
        {
          id: 'adminEmail',
          label: 'Admin Email',
          type: 'email',
          value: settings.adminEmail || 'admin@example.com',
          placeholder: 'admin@example.com',
          description: 'Email address for system notifications'
        },
        {
          id: 'smtpHost',
          label: 'SMTP Host',
          type: 'text',
          value: settings.smtpHost || '',
          placeholder: 'smtp.gmail.com',
          description: 'SMTP server for sending emails'
        },
        {
          id: 'smtpPort',
          label: 'SMTP Port',
          type: 'number',
          value: settings.smtpPort || 587,
          placeholder: '587',
          description: 'SMTP server port'
        }
      ]
    },
    {
      id: 'data',
      title: 'Data Management',
      description: 'Database and data handling settings',
      icon: Database,
      fields: [
        {
          id: 'autoBackup',
          label: 'Automatic Backups',
          type: 'checkbox',
          value: settings.autoBackup || true,
          description: 'Automatically backup data daily'
        },
        {
          id: 'backupRetention',
          label: 'Backup Retention (days)',
          type: 'number',
          value: settings.backupRetention || 30,
          placeholder: '30',
          description: 'How long to keep backup files'
        },
        {
          id: 'dataRetention',
          label: 'User Data Retention (days)',
          type: 'number',
          value: settings.dataRetention || 365,
          placeholder: '365',
          description: 'How long to keep inactive user data'
        },
        {
          id: 'enableAnalytics',
          label: 'Enable Analytics',
          type: 'checkbox',
          value: settings.enableAnalytics || true,
          description: 'Collect usage analytics and performance metrics'
        }
      ]
    }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from an API
      // For now, we'll use default values
      setSettings({
        siteName: 'CV Builder',
        siteDescription: 'Professional CV Builder with AI Assistance',
        defaultLanguage: 'en',
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: false,
        maxUsersPerDay: 100,
        sessionTimeout: 60,
        enableTwoFactor: false,
        passwordMinLength: 8,
        maxLoginAttempts: 5,
        enableAuditLog: true,
        emailNotifications: true,
        adminEmail: 'admin@example.com',
        smtpHost: '',
        smtpPort: 587,
        autoBackup: true,
        backupRetention: 30,
        dataRetention: 365,
        enableAnalytics: true
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // In a real app, this would save to an API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported successfully');
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          toast.success('Settings imported successfully');
        } catch (error) {
          toast.error('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const renderField = (field: SettingsField) => {
    const commonProps = {
      id: field.id,
      value: field.value,
      onChange: (e: any) => handleFieldChange(field.id, e.target.value),
      className: 'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
      placeholder: field.placeholder,
      required: field.required
    };

    switch (field.type) {
      case 'checkbox':
        return (
          <input
            {...commonProps}
            type="checkbox"
            checked={field.value}
            onChange={(e) => handleFieldChange(field.id, e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        );
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        );
      case 'select':
        return (
          <select {...commonProps}>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return <input {...commonProps} type={field.type} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full py-4 px-4 sm:px-6 lg:px-8 lg:pl-72">
        {/* Header */}
        <div className="px-4 py-4 sm:px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/adminx')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Settings className="w-8 h-8 text-blue-600 mr-3" />
                  Admin Settings
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Configure system settings and preferences
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportSettings}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <label className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-5 w-5" />
                        <div>
                          <div>{section.title}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {section.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              {settingsSections.map((section) => {
                if (activeSection !== section.id) return null;
                
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white shadow rounded-lg"
                  >
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <section.icon className="w-6 h-6 text-blue-600 mr-3" />
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">
                            {section.title}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-6">
                      <div className="space-y-6">
                        {section.fields.map((field) => (
                          <div key={field.id}>
                            <label
                              htmlFor={field.id}
                              className="block text-sm font-medium text-gray-700"
                            >
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <div className="mt-1">
                              {renderField(field)}
                            </div>
                            {field.description && (
                              <p className="mt-2 text-sm text-gray-500">
                                {field.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
    </div>
  );
}
