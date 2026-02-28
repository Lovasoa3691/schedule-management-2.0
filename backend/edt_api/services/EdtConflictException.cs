namespace edt_api.services;

public class EdtConflictException: Exception
{
    public EdtConflictException(string message) : base(message) { }
}