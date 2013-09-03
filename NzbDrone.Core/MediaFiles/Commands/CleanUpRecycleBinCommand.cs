using System;
using NzbDrone.Common;
using NzbDrone.Common.Messaging;

namespace NzbDrone.Core.MediaFiles.Commands
{
    public class CleanUpRecycleBinCommand : ICommand
    {
        public String CommandId { get; private set; }

        public CleanUpRecycleBinCommand()
        {
            CommandId = HashUtil.GenerateCommandId();
        }
    }
}