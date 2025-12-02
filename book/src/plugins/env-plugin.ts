import { LoadContext, Plugin } from '@docusaurus/types';
import path from 'path';
import fs from 'fs';

function loadEnvFile(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), '.env.local');
  const env: Record<string, string> = {};

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          env[key.trim()] = value.trim();
        }
      }
    });
  }

  // Also check process.env for variables
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith('NEXT_PUBLIC_') || key.startsWith('REACT_APP_') || key.startsWith('SUPABASE_')) {
      env[key] = process.env[key] || '';
    }
  });

  return env;
}

export default function envPlugin(context: LoadContext, options: {}): Plugin {
  const env = loadEnvFile();

  return {
    name: 'env-plugin',
    configureWebpack(config, isServer) {
      if (!isServer) {
        // Inject environment variables into client-side code
        const definePlugin = config.plugins?.find(
          (plugin: any) => plugin.constructor.name === 'DefinePlugin'
        );

        const envVars: Record<string, string> = {};
        Object.keys(env).forEach((key) => {
          envVars[`process.env.${key}`] = JSON.stringify(env[key]);
        });

        return {
          plugins: [
            ...(config.plugins || []),
            new (require('webpack')).DefinePlugin(envVars),
          ],
        };
      }
      return {};
    },
  };
}

