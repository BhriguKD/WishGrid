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
                    a.download = 'wishgrid_data.json';
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

    const importInput = document.getElementById('import-data');
    if (importInput) {
        importInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('php/import_data.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    alert('Data imported successfully!');
                    window.location.reload();
                } else {
                    throw new Error('Import failed');
                }
            } catch (error) {
                console.error('Import error:', error);
                alert('Failed to import data. Please try again.');
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