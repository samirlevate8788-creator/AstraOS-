rule AstraOS_Harmless_Training_Marker
{
    meta:
        description = "A harmless text marker used to learn YARA rule matching"
        scope = "local training sample only"

    strings:
        $marker = "ASTRAOS_TRAINING_SAMPLE"

    condition:
        $marker
}
