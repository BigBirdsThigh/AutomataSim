namespace AutomatonBackend.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;


public class LogResponse : ActionFilterAttribute
{
    public override void OnActionExecuted(ActionExecutedContext context)
    {
        var objectResult = context.Result as ObjectResult;
        if (objectResult != null)
        {
            string json = System.Text.Json.JsonSerializer.Serialize(objectResult.Value);
            context.HttpContext.RequestServices.GetRequiredService<ILogger<LogResponse>>().LogInformation("Response: {response}", json);
        }
    }
}
