﻿using System;
using System.Net.Http;

namespace Silktide.Plugin.Clients
{
    public abstract class BaseRequestClient : IDisposable
    {
        private static readonly object _locker = new();
        private static volatile HttpClient _client;

        protected static HttpClient Client
        {
            get
            {
                if (_client == null)
                {
                    lock (_locker)
                    {
                        _client ??= new HttpClient();
                    }
                }

                return _client;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                _client?.Dispose();

                _client = null;
            }
        }
    }
}
