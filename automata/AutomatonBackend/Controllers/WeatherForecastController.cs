using Microsoft.AspNetCore.Mvc;

using automata.sim.automata;
namespace AutomatonBackend.Controllers;

[ApiController]
[Route("")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [HttpGet("DFA")] // sets the route for this action
    public WeatherForecast Get(){
           // our states
        State q0 = new State("Q0", false);
        State q1 = new State("Q1", false);
        State q2 = new State("Q2", true);
        State q3 = new State("Q3", false);

        // transitions
        q0.AddTransition('a', q1);
        q1.AddTransition('b', q2);
        q2.AddTransition('a', q3);
        q3.AddTransition('b', q2);
        DFA dfa = new DFA(q0);

        return new WeatherForecast{
            Date = DateOnly.FromDateTime(DateTime.Now),
            TemperatureC = Random.Shared.Next(1, 3),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)],
            Valid = dfa.Simulate("ab")
        };
    }


    // [HttpGet(Name = "GetWeatherForecast")]
    // public IEnumerable<WeatherForecast> Get()
    // {
      
    //     return Enumerable.Range(1, 5).Select(index => new WeatherForecast
    //     {
    //         Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
    //         TemperatureC = Random.Shared.Next(1, 3),
    //         Summary = Summaries[Random.Shared.Next(Summaries.Length)],
    //         Valid = false
    //     })
    //     .ToArray();
    // }
}
