using edt_api.dtos;
using edt_api.services;
using Microsoft.AspNetCore.Mvc;

namespace edt_api.controllers;

[ApiController]
[Route("api/edt")]
public class EdtController: ControllerBase
{
    private readonly IEdt _service;

    public EdtController(IEdt service)
    {
        _service = service;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<EdtDto>>> GetAll(
        string id,
        [FromQuery] DateOnly? startDate,
        [FromQuery] DateOnly? endDate)
    {
        var result = await _service.GetAllAsync(id, startDate, endDate);
        return Ok(result);
    }

    [HttpGet("{id}/week_{week}")]
    public async Task<ActionResult<IEnumerable<EdtDto>>> GetEdtByWeek(string id, string week)
    {
        var result = await _service.GetEdtByWeek(id, week);
        return Ok(result);
    }

    [HttpGet("filter/{id}")]
    public async Task<ActionResult<EdtDto>> GetById(string id)
    {
        var res = await _service.GetByIdAsync(id);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpPost]
    public async Task<ActionResult<EdtDto>> Create([FromBody] CreateEdtDto dto)
    {
        try
        {
            var created = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById),
                new { id = created.numEd },
                created);
        }
        catch (EdtConflictException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdateEdtDto dto)
    {
        var ok = await _service.UpdateAsync(id, dto);
        return ok ? NoContent() : NotFound();
    }
    
    [HttpPut("cancel/{id}")]
    public async Task<IActionResult> Cancel(string id)
    {
        var ok = await _service.CancelAsync(id);
        return ok ? NoContent() : NotFound();
    }

    [HttpPut("status/{id}/done")]
    public async Task<IActionResult> UpdateStatus(string id)
    {
        var ok = await _service.UpdateStatusAsync(id);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}