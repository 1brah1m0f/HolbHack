'use client';

import { RecallResponse } from '@/shared/types';
import { Card } from './ui/Card';

interface ResultCardsProps {
  data: RecallResponse['data'];
}

export function ResultCards({ data }: ResultCardsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {/* Past Journey Card */}
      <Card title="Your Past Journey" className="border-l-4 border-blue-500">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">{data.summary.title}</h4>
            <ul className="space-y-2">
              {data.summary.pastEvents.map((event, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">{event}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Current Quest:</span> {data.summary.currentQuest}
            </p>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Key NPCs Met:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {data.summary.keyNPCsMet.map((npc, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {npc}
                </span>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Last Known Location:</span> {data.summary.lastKnownLocation}
            </p>
          </div>
        </div>
      </Card>

      {/* Next Steps Card */}
      <Card title="Next Steps" className="border-l-4 border-green-500">
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-green-800">Immediate Action:</span>{' '}
              {data.nextSteps.immediateAction}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Short-term Goals</h4>
            <ul className="space-y-2">
              {data.nextSteps.shortTermGoals.map((goal, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">→</span>
                  <span className="text-gray-700">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-2">Tips</h4>
            <ul className="space-y-2">
              {data.nextSteps.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-500 mr-2">💡</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {data.nextSteps.warnings && data.nextSteps.warnings.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-red-900 mb-2">Warnings</h4>
              <ul className="space-y-2">
                {data.nextSteps.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">⚠️</span>
                    <span className="text-gray-700">{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
