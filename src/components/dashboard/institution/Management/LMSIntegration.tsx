import React, { useState } from 'react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Badge from '../../../../components/ui/Badge';
import Alert from '../../../../components/ui/Alert';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';

interface Integration {
  id: string;
  platform: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  syncFrequency: 'hourly' | 'daily' | 'weekly';
  settings: Record<string, string>;
  dataTypes: string[];
}

interface LMSIntegrationProps {
  integrations: Integration[];
  onConnect?: (platform: string, settings: Record<string, string>) => Promise<void>;
  onDisconnect?: (integrationId: string) => Promise<void>;
  onUpdateSettings?: (integrationId: string, settings: Record<string, string>) => Promise<void>;
  onSyncNow?: (integrationId: string) => Promise<void>;
}

const LMSIntegration: React.FC<LMSIntegrationProps> = ({
  integrations,
  onConnect,
  onDisconnect,
  onUpdateSettings,
  onSyncNow
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const platforms = [
    {
      name: 'Moodle',
      requiredSettings: ['url', 'apiKey', 'secretKey']
    },
    {
      name: 'Canvas',
      requiredSettings: ['accessToken', 'domain']
    },
    {
      name: 'Blackboard',
      requiredSettings: ['applicationId', 'secretKey', 'domain']
    },
    {
      name: 'Google Classroom',
      requiredSettings: ['clientId', 'clientSecret']
    }
  ];

  const handleConnect = async () => {
    if (!selectedPlatform) return;

    const platform = platforms.find(p => p.name === selectedPlatform);
    if (!platform) return;

    const missingSettings = platform.requiredSettings.filter(
      setting => !settings[setting]
    );

    if (missingSettings.length > 0) {
      setError(`Missing required settings: ${missingSettings.join(', ')}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onConnect?.(selectedPlatform, settings);
      setShowConnectForm(false);
      setSettings({});
      setSelectedPlatform('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (integrationId: string) => {
    setLoading(true);
    try {
      await onSyncNow?.(integrationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">LMS Integration</h2>
        <Button
          onClick={() => setShowConnectForm(true)}
          variant="primary"
        >
          Connect New Platform
        </Button>
      </div>

      {/* Connect Form */}
      {showConnectForm && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Connect LMS Platform</h3>
          <div className="space-y-4">
            <Select
              label="Platform"
              value={selectedPlatform}
              onChange={e => {
                setSelectedPlatform(e.target.value);
                setSettings({});
              }}
              options={[
                { value: '', label: 'Select Platform' },
                ...platforms.map(p => ({ value: p.name, label: p.name }))
              ]}
            />

            {selectedPlatform && (
              <div className="space-y-4">
                {platforms
                  .find(p => p.name === selectedPlatform)
                  ?.requiredSettings.map(setting => (
                    <Input
                      key={setting}
                      label={setting.charAt(0).toUpperCase() + setting.slice(1)}
                      value={settings[setting] || ''}
                      onChange={e => setSettings({
                        ...settings,
                        [setting]: e.target.value
                      })}
                      type={setting.toLowerCase().includes('secret') || setting.toLowerCase().includes('key') ? 'password' : 'text'}
                      placeholder={`Enter ${setting}`}
                    />
                  ))}
              </div>
            )}

            {error && (
              <Alert variant="error">
                {error}
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleConnect}
                variant="primary"
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : 'Connect'}
              </Button>
              <Button
                onClick={() => {
                  setShowConnectForm(false);
                  setSettings({});
                  setSelectedPlatform('');
                  setError(null);
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Integrations List */}
      <div className="grid gap-4">
        {integrations.map(integration => (
          <Card key={integration.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold">{integration.platform}</h4>
                  <Badge
                    variant={
                      integration.status === 'connected' ? 'success' :
                      integration.status === 'error' ? 'danger' : 'warning'
                    }
                  >
                    {integration.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  Last synced: {integration.lastSync?.toLocaleString() || 'Never'}
                </div>
                <div className="text-sm text-gray-500">
                  Sync frequency: {integration.syncFrequency}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {integration.dataTypes.map(type => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSync(integration.id)}
                  variant="secondary"
                  disabled={loading || integration.status !== 'connected'}
                >
                  {loading ? <LoadingSpinner /> : 'Sync Now'}
                </Button>
                <Button
                  onClick={() => onDisconnect?.(integration.id)}
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LMSIntegration;
