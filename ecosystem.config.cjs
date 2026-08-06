module.exports = {
  apps: [
    {
      name: 'shuyuan',
      script: 'node_modules/.bin/tsx',
      args: 'src/server/index.ts',
      env: {
        NODE_ENV: 'production',
      },
      // 自动重启
      autorestart: true,
      max_restarts: 10,
      // 日志
      error_file: 'server/logs/error.log',
      out_file: 'server/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // 内存限制
      max_memory_restart: '500M',
    },
  ],
}
