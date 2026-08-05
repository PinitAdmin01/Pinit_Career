import time
import os
from typing import Dict, Any

try:
    import psutil
    HAS_PSUTIL = True
except ImportError:
    HAS_PSUTIL = False

class TelemetryCollector:
    """Phase 15: Telemetry & Prometheus Metrics Collector."""

    def __init__(self):
        self.requests_total = 0
        self.audio_seconds_total = 0.0
        self.cache_hits: Dict[str, int] = {
            "indexeddb": 0,
            "redis": 0,
            "ssd": 0,
            "supabase": 0,
        }
        self.total_latency_ms = 0.0
        self.start_time = time.time()

    def record_request(self, duration_sec: float, latency_ms: float, cache_source: str = None):
        """Records telemetry data for a completed TTS request."""
        self.requests_total += 1
        self.audio_seconds_total += duration_sec
        self.total_latency_ms += latency_ms

        if cache_source:
            source_lower = cache_source.lower()
            if "redis" in source_lower:
                self.cache_hits["redis"] += 1
            elif "ssd" in source_lower:
                self.cache_hits["ssd"] += 1
            elif "supabase" in source_lower:
                self.cache_hits["supabase"] += 1
            elif "indexeddb" in source_lower:
                self.cache_hits["indexeddb"] += 1

    def get_system_metrics(self) -> Dict[str, Any]:
        """Collects current process CPU, RAM, and system uptime metrics."""
        memory_rss_bytes = 104857600  # Default 100MB
        cpu_percent = 5.0

        if HAS_PSUTIL:
            try:
                process = psutil.Process(os.getpid())
                memory_rss_bytes = process.memory_info().rss
                cpu_percent = process.cpu_percent(interval=None)
            except Exception:
                pass

        return {
            "uptime_seconds": int(time.time() - self.start_time),
            "cpu_percent": cpu_percent,
            "memory_rss_bytes": memory_rss_bytes,
            "memory_rss_mb": round(memory_rss_bytes / (1024 * 1024), 2),
            "requests_total": self.requests_total,
            "audio_seconds_total": round(self.audio_seconds_total, 2),
            "avg_latency_ms": round(self.total_latency_ms / max(1, self.requests_total), 2),
            "cache_hits": self.cache_hits,
        }

    def generate_prometheus_text(self) -> str:
        """Generates standard Prometheus format telemetry text."""
        metrics = self.get_system_metrics()
        lines = [
            "# HELP tts_requests_total Total number of TTS synthesis requests handled",
            "# TYPE tts_requests_total counter",
            f"tts_requests_total {metrics['requests_total']}",
            "",
            "# HELP tts_audio_seconds_total Total seconds of voice audio synthesized",
            "# TYPE tts_audio_seconds_total counter",
            f"tts_audio_seconds_total {metrics['audio_seconds_total']}",
            "",
            "# HELP tts_avg_latency_ms Average synthesis latency in milliseconds",
            "# TYPE tts_avg_latency_ms gauge",
            f"tts_avg_latency_ms {metrics['avg_latency_ms']}",
            "",
            "# HELP process_memory_rss_bytes Resident memory size in bytes",
            "# TYPE process_memory_rss_bytes gauge",
            f"process_memory_rss_bytes {metrics['memory_rss_bytes']}",
            "",
            "# HELP process_cpu_percent Process CPU utilization percentage",
            "# TYPE process_cpu_percent gauge",
            f"process_cpu_percent {metrics['cpu_percent']}",
            "",
            "# HELP tts_cache_hits_total Total cache hits by storage tier",
            "# TYPE tts_cache_hits_total counter",
            f'tts_cache_hits_total{{source="redis"}} {self.cache_hits["redis"]}',
            f'tts_cache_hits_total{{source="ssd"}} {self.cache_hits["ssd"]}',
            f'tts_cache_hits_total{{source="supabase"}} {self.cache_hits["supabase"]}',
            f'tts_cache_hits_total{{source="indexeddb"}} {self.cache_hits["indexeddb"]}',
        ]
        return "\n".join(lines)

telemetry = TelemetryCollector()
