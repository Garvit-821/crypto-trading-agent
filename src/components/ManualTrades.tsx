import { useState, useEffect } from 'react';
import { Send, Clock, TrendingUp } from 'lucide-react';
import { supabase, ManualTrade } from '../lib/supabase';

export function ManualTrades() {
  const [trades, setTrades] = useState<ManualTrade[]>([]);
  const [formData, setFormData] = useState({
    coin_name: '',
    entry_price: '',
    stop_loss: '',
    target_price: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    const { data } = await supabase
      .from('manual_trades')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setTrades(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const { data, error } = await supabase
      .from('manual_trades')
      .insert([{
        coin_name: formData.coin_name,
        entry_price: parseFloat(formData.entry_price),
        stop_loss: parseFloat(formData.stop_loss),
        target_price: parseFloat(formData.target_price),
        message: formData.message
      }])
      .select()
      .single();

    if (data && !error) {
      setTrades(prev => [data, ...prev]);
      setFormData({
        coin_name: '',
        entry_price: '',
        stop_loss: '',
        target_price: '',
        message: ''
      });
    }

    setSending(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Manual Trade Feed</h2>
        <p className="text-gray-600 mt-1">Broadcast custom trading signals to your community</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Send className="w-5 h-5 mr-2 text-blue-600" />
          Admin Input Panel
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coin Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., BTC/USDT"
                value={formData.coin_name}
                onChange={(e) => setFormData({ ...formData, coin_name: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entry Price
              </label>
              <input
                type="number"
                required
                step="0.0001"
                placeholder="0.00"
                value={formData.entry_price}
                onChange={(e) => setFormData({ ...formData, entry_price: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stop Loss
              </label>
              <input
                type="number"
                required
                step="0.0001"
                placeholder="0.00"
                value={formData.stop_loss}
                onChange={(e) => setFormData({ ...formData, stop_loss: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Price
              </label>
              <input
                type="number"
                required
                step="0.0001"
                placeholder="0.00"
                value={formData.target_price}
                onChange={(e) => setFormData({ ...formData, target_price: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              placeholder="Add any additional context or notes..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {sending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Broadcasting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Alert</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade History</h3>
        <div className="space-y-4">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 border border-blue-200 rounded-lg p-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{trade.coin_name}</h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(trade.created_at)}
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                  MANUAL
                </div>
              </div>

              {trade.message && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">{trade.message}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-gray-600 text-xs mb-1">Entry Price</p>
                  <p className="text-gray-900 font-semibold">${trade.entry_price}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-gray-600 text-xs mb-1">Stop Loss</p>
                  <p className="text-red-600 font-semibold">${trade.stop_loss}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-gray-600 text-xs mb-1">Target</p>
                  <p className="text-green-600 font-semibold">${trade.target_price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {trades.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
            <Send className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No manual trades broadcasted yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
