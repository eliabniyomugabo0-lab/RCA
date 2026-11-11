# Image Credits — Stadium Photo Library

The stadium photography bundled in `src/assets/images/` is stored locally so the
gallery renders instantly and works fully offline. The library is deliberately
**cricket-stadium led**: real photography of Gahanga Cricket Stadium, plus cricket
ground infrastructure (pavilions, scoreboards, wickets, floodlights) rather than
general landscape or residential imagery.

## Photographs of Gahanga Cricket Stadium

| Local file | Original (Wikimedia Commons) | Author | License |
|---|---|---|---|
| `gcs_pavilion_vaults_1792306844132.jpg` | *Gahanga Cricket Stadium 2024 05* | Ndahiro derrick | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) |
| `gcs_pavilion_exterior_1792306860001.jpg` | *Gahanga Cricket Stadium 39* | Score Beethoven | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_vault_ceiling_detail_1792306860002.jpg` | *Gahanga Cricket Stadium 43* | Score Beethoven | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_outfield_boundary_1792306860003.jpg` | *Gahanga Cricket Stadium 37* | Score Beethoven | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_floodlight_tower_1792306860004.jpg` | *Gahanga Cricket Stadium 45* | Score Beethoven | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_pavilion_hospitality_1792306860008.jpg` | *Gahanga Cricket Stadium 42* | Score Beethoven | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_pavilion_bar_1792306860009.jpg` | *Gahanga Cricket Stadium 41* | Score Beethoven | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_practice_nets_1792306845092.jpg` | *Gahanga Cricket Stadium 36* | Score Beethoven | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_turf_curation_1792306850003.jpg` | *Gahanga Cricket Stadium 2024 10* | Ndahiro derrick | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) |
| `gcs_aerial_panorama_1792306850001.jpg` | *GCS Drone Shot-YT* | Benelias99 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_rwanda_squad_1792306860005.jpg` | *Home Secretary Suella Braverman celebrates with cricketers at the Gahanga Cricket Stadium in Rwanda. (52760006296)* | UK Home Office | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| `gcs_team_bench_1792306860006.jpg` | *Home Secretary Suella Braverman speaks with cricketers at the Gahanga Cricket Stadium in Rwanda. (52760008676)* | UK Home Office | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| `gcs_pitch_ceremony_1792306860007.jpg` | *Home Secretary Suella Braverman on the pitch with captains at the Gahanga Cricket Stadium in Rwanda. (52760416995)* | UK Home Office | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |

## Cricket ground infrastructure & match operations

| Local file | Original (Wikimedia Commons) | Author | License |
|---|---|---|---|
| `gcs_matchday_action_1792306844646.jpg` | *Hatfield Heath CC v. Netteswell CC on Hatfield Heath village green, Essex, England 07* | Acabashi | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_match_intensity_1792306850002.jpg` | *Hatfield Heath CC v. Netteswell CC on Hatfield Heath village green, Essex, England 05* | Acabashi | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_pitch_preparation_1792306844687.jpg` | *Holtwhites Trinibis Cricket Club groundsman mower and Powerroll roller* | Acabashi | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_floodlight_night_1792306845634.jpg` | *IPL 2011 - KKR vs PW - 19 May 2011* | Sankarshan Mukhopadhyay | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) |
| `gcs_scoreboard_manual_1792306860011.jpg` | *Cricket scoreboard box at Epping Cricket Club, Essex, England 01* | Acabashi | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_scoreboard_overs_1792306860012.jpg` | *Loughton Cricket Club ground scoreboard at Loughton, Essex, England* | Acabashi | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_wicket_stumps_1792306860013.jpg` | *Church Times Cricket Cup final 2019, Wicket 2* | Acabashi | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_pavilion_matchday_1792306860014.jpg` | *Cambridge University CC v MCC at Cambridge, England 131* | Acabashi | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `gcs_long_room_1792306860015.jpg` | *Lords Long Room* | DieSwartzPunkt | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |

## Studio-Generated Renders & Avatars

- `gcs_stadium_exterior_1791894260939.jpg` and the staff avatar images are original
  renders/portraits created for this project and are covered by the repository licence.

## Notes

- Every file above was resized to a maximum width of 1600 px and re-encoded as a
  progressive JPEG to keep the bundle light.
- Wide shots that framed surrounding hillside housing (`gcs_aerial_panorama`,
  `gcs_turf_curation`, `gcs_outfield_boundary`) were cropped so the cricket ground is
  the subject rather than the neighbourhood.
- Wikimedia Commons images are licensed CC BY / CC BY-SA. The share-alike terms apply to
  the derivative images as stored in this repository.
- The gallery component (`src/components/common/StadiumImageSlider.tsx`) keeps a local
  fallback for every slide, so a failed or offline load never shows a broken image.
