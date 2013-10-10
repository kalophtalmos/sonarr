'use strict';
define(['vent', 'Cells/NzbDroneCell'],
    function(vent,NzbDroneCell) {
        return NzbDroneCell.extend({
            className: 'episode-title-cell',
            render: function () {
                console.log(this.cellValue.get('title'));
                var title = this.cellValue.get('title');

                this.$el.html(title);

                return this;
            }
        });

    }
);