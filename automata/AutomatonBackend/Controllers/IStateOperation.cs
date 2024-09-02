using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
namespace AutomatonBackend.Controllers;

public interface IStateOperation
{
    void AddState(string name, bool IsAcceptState);
    void deleteState(StateDelete state);
    void update(Positions positions);
    PositionResponse retrieve(string args);
    void AddTransition(Transition transition);
    void DeleteTransition(Transition transition);
    MachineResponse<bool, T> simulate<T>(string test);
}
