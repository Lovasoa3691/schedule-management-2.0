using edt_api.dtos;
using edt_api.services;
using Microsoft.AspNetCore.Mvc;

namespace edt_api.controllers;

[ApiController]
[Route("api/mention")]
public class MentionController: ControllerBase
{
    private readonly IMention _service;

    public MentionController(IMention service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MentionDto>>> GetAll()
        => Ok(await _service.getAllAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult<MentionDto>> GetById(int id)
    {
        var res = await _service.getByIdAsync(id);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpPost]
    public async Task<ActionResult<MentionDto>> Create([FromBody] CreateMentionDto dto)
    {
        var created = await _service.addAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.idMent }, created);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateMentionDto dto)
    {
        var ok = await _service.updateAsync(id, dto);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.deleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}