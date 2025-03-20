'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleThemeChange = async (newTheme: string) => {
    setLoading(true);
    try {
      await setTheme(newTheme);
    } catch (error) {
      console.error('Failed to change theme:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Theme</h3>
                  <p className="text-sm text-gray-500">Choose your preferred theme</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleThemeChange('light')}
                    disabled={loading}
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleThemeChange('dark')}
                    disabled={loading}
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleThemeChange('system')}
                    disabled={loading}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
} 