import React from 'react';
import { Settings, ShieldCheck, Database, Key, Server, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Governance Settings & System Controls</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure VTU Super App API integrations, Controller digital signatures, and audit logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Controller Digital Signature Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Controller Name" defaultValue="Dr. K. V. Suresh" />
            <Input label="Official Title" defaultValue="VTU Controller of Examinations" />
            <Input label="University Email" defaultValue="controller@vtu.ac.in" />

            <Button variant="primary" className="w-full">
              Save Signature Credentials
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span>Database Sync & Backups</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-accent/40 border border-border text-xs space-y-2">
              <div className="flex justify-between font-bold">
                <span>Last Database Backup</span>
                <span className="text-emerald-600 dark:text-emerald-400">Today, 04:30 AM</span>
              </div>
              <p className="text-muted-foreground">
                Automated snapshot synced with VTU Belagavi Central Data Vault.
              </p>
            </div>

            <Button variant="outline" className="w-full" icon={<Server className="h-4 w-4" />}>
              Trigger Manual Backup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
