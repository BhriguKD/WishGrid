document.addEventListener('DOMContentLoaded', function() {
    const exportButton = document.getElementById('export-data');
    if (exportButton) {
        exportButton.addEventListener('click', async function() {
            try {
                const response = await fetch('../php/export_data.php', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'wishgrid_data.csv';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } else {
                    throw new Error('Export failed');
                }
            } catch (error) {
                console.error('Export error:', error);
                alert('Failed to export data. Please try again.');
            }
        });
    }

    const clearButton = document.getElementById('clear-data');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            const modal = document.getElementById('confirm-modal');
            if (modal) {
                modal.classList.remove('hidden');
            }
        });
    }
    const confirmClear = document.getElementById('confirm-clear');
    if (confirmClear) {
        confirmClear.addEventListener('click', async function() {
            try {
                const response = await fetch('php/clear_data.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Data cleared successfully!');
                    window.location.reload();
                } else {
                    throw new Error('Clear failed');
                }
            } catch (error) {
                console.error('Clear error:', error);
                alert('Failed to clear data. Please try again.');
            }
        });
    }

    const cancelClear = document.getElementById('cancel-clear');
    if (cancelClear) {
        cancelClear.addEventListener('click', function() {
            const modal = document.getElementById('confirm-modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    }
}); 