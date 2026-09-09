namespace SchedConnect.Monitoring.Models.Metrics;

public class DatabaseMetric
{
    public bool IsAvailable { get; set; }

    public int ActiveConnections { get; set; }

    public int IdleConnections { get; set; }

    public double AverageQueryDurationMs { get; set; }

    public long FailedQueries { get; set; }

    public DateTime Timestamp { get; set; }
}