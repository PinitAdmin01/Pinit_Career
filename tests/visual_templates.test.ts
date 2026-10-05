import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PYTHON_M1_VISUALS } from '../src/lib/data/lessonVisuals/pythonMonth1Visuals';
import {
  VisualStage,
  FlowTemplate,
  BoxesTemplate,
  TableTemplate,
  LettersTemplate,
  CompareTemplate,
} from '../src/app/quests/lesson/components/visuals';

describe('V-05: Visual Templates & VisualStage Rendering', () => {
  it('renders all 18 visuals across all steps with no errors', () => {
    let renderedStepsCount = 0;

    for (const [key, entry] of Object.entries(PYTHON_M1_VISUALS)) {
      const { visual } = entry;

      for (let stepIdx = 0; stepIdx < visual.steps.length; stepIdx++) {
        // 1. Render through VisualStage
        const stageHtml = renderToStaticMarkup(
          React.createElement(VisualStage, {
            visual,
            currentStepIndex: stepIdx,
            onStepChange: () => {},
            isManualOverride: false,
            onSyncWithVoice: () => {},
            highlightedLabel: null,
            onShapeTap: () => {},
          })
        );

        assert.ok(stageHtml.length > 50, `VisualStage HTML empty for ${key} step ${stepIdx}`);
        // Escape HTML special characters for matching
        const escapedCaption = visual.steps[stepIdx].caption
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;');
        assert.ok(
          stageHtml.includes(escapedCaption) || stageHtml.includes(visual.steps[stepIdx].caption),
          `Caption missing for ${key} step ${stepIdx}`
        );

        // 2. Render through specific template directly
        let templateHtml = '';
        if (visual.template === 'flow') {
          templateHtml = renderToStaticMarkup(
            React.createElement(FlowTemplate, {
              nodes: visual.nodes,
              step: visual.steps[stepIdx],
              highlightedLabel: null,
              onShapeTap: () => {},
            })
          );
        } else if (visual.template === 'boxes') {
          templateHtml = renderToStaticMarkup(
            React.createElement(BoxesTemplate, {
              boxes: visual.boxes,
              step: visual.steps[stepIdx],
              highlightedLabel: null,
              onShapeTap: () => {},
            })
          );
        } else if (visual.template === 'table') {
          templateHtml = renderToStaticMarkup(
            React.createElement(TableTemplate, {
              columns: visual.columns,
              step: visual.steps[stepIdx],
            })
          );
        } else if (visual.template === 'letters') {
          templateHtml = renderToStaticMarkup(
            React.createElement(LettersTemplate, {
              text: visual.text,
              step: visual.steps[stepIdx],
            })
          );
        } else if (visual.template === 'compare') {
          templateHtml = renderToStaticMarkup(
            React.createElement(CompareTemplate, {
              leftLabel: visual.leftLabel,
              rightLabel: visual.rightLabel,
              step: visual.steps[stepIdx],
            })
          );
        }

        assert.ok(templateHtml.length > 20, `Template HTML empty for ${key} step ${stepIdx}`);
        renderedStepsCount++;
      }
    }

    assert.ok(renderedStepsCount >= 40, `Expected at least 40 steps, got ${renderedStepsCount}`);
    console.log(`Rendered ${renderedStepsCount} visual steps successfully.`);
  });

  it('renders word-tap highlighting without error', () => {
    const entry22 = PYTHON_M1_VISUALS['python:2:1'];
    assert.ok(entry22 && entry22.visual.template === 'boxes');

    const htmlWithHighlight = renderToStaticMarkup(
      React.createElement(VisualStage, {
        visual: entry22.visual,
        currentStepIndex: 0,
        onStepChange: () => {},
        isManualOverride: false,
        onSyncWithVoice: () => {},
        highlightedLabel: 'balance',
        onShapeTap: () => {},
      })
    );

    assert.ok(htmlWithHighlight.includes('balance'));
  });
});
